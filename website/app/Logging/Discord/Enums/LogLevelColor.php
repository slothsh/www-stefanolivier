<?php

namespace App\Logging\Discord\Enums;

use Monolog\Level;

enum LogLevelColor : int {
    case DEBUG = 6579300;
    case INFO = 7440858;
    case NOTICE = 62824;
    case WARNING = 14464075;
    case ERROR = 14453760;
    case CRITICAL = 14426915;
    case EMERGENCY = 6553600;

    public static function fromLogLevel(Level $level): self {
        return match ($level) {
            Level::Debug => self::DEBUG,
            Level::Info => self::INFO,
            Level::Notice => self::NOTICE,
            Level::Warning => self::WARNING,
            Level::Error => self::ERROR,
            Level::Critical => self::CRITICAL,
            Level::Emergency => self::EMERGENCY,
        };
    }
}
