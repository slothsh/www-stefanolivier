<?php

namespace App\Logging\Discord;

use App\Logging\Discord\Enums\LogLevelColor;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Monolog\Handler\AbstractProcessingHandler;
use Monolog\Level;
use Monolog\LogRecord;

class DiscordLoggerHandler extends AbstractProcessingHandler {
    protected string $webhookUrl;

    protected const USERNAME = 'Website';
    protected const AVATAR_URL = 'https://stefanolivier.imgix.net/img/owlsh.jpg';

    public function __construct(string $webhookUrl, $level = Level::Notice, bool $bubble = true) {
        parent::__construct($level, $bubble);
        $this->webhookUrl = $webhookUrl;
    }

    protected function write(LogRecord $record): void {
        try {
            $embedEntry = [
                'color' => LogLevelColor::fromLogLevel($record->level)->value,
                'title' => self::contextOr($record, 'title', $record->level->name),
                'fields' => [
                    [
                        'name' => '',
                        'value' => $record->message,
                    ]
                ],
                'url' => self::contextOr($record, 'url', 'https://stefanolivier.com'), // TODO: company meta
                'author' => [
                    'name' => self::contextOr($record, 'author.name', self::USERNAME),
                    'icon_url' => self::contextOr($record, 'author.icon_url', self::AVATAR_URL),
                ],
            ];

            Http::contentType('application/json')
                ->post($this->webhookUrl, [
                    'username' => self::contextOr($record, 'username', self::USERNAME),
                    'avatar_url' => self::contextOr($record, 'avatar_url', self::AVATAR_URL),
                    'embeds' => [$embedEntry],
                ]);
        } catch (\Throwable $e) {
            Log::error('Failed to log to Discord webhook', ['exception' => $e, 'record' => json_encode($record), 'webhook_url' => $this->webhookUrl]);
        }
    }

    private static function contextOr(LogRecord $record, string $path, string $default): string {
        $value = Arr::get($record['context'], $path);
        if (!empty($value) && is_string($value)) {
            return $value;
        }

        return $default;
    }
}
