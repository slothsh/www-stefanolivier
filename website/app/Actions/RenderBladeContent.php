<?php

namespace App\Actions;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Blade;
use stdClass;

class RenderBladeContent
{
    public function __invoke(mixed $data, array $dataForView = []): mixed {
        if ($data instanceof stdClass) {
            foreach ($data as $key => $value) {
                $data->{$key} = $this->__invoke($value, $dataForView);
            }

            return $data;
        }

        if (is_object($data) || is_array($data) || $data instanceof Collection) {
            foreach ($data as $key => $value) {
                $data[$key] = $this->__invoke($value, $dataForView);
            }

            return $data;
        }

        if (is_string($data) && strlen($data) > 0) {
            return Blade::render($data, $dataForView);
        }

        return $data;
    }
}
