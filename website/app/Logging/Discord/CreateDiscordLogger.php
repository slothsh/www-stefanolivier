<?php

namespace App\Logging\Discord;

use Monolog\Logger;

class CreateDiscordLogger {
    protected string $webhookUrl;

    public function __invoke(array $config): Logger {
        $this->webhookUrl = $config['url'];

        $logger = new Logger('discord');
        $handler = new DiscordLoggerHandler($config['url'], Logger::toMonologLevel($config['level'] ?? 'notice'));
        $logger->pushHandler($handler);

        return $logger;
    }
}
