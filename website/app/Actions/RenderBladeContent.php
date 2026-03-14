<?php

namespace App\Actions;

use Illuminate\Support\Facades\Blade;

class RenderBladeContent
{
    public function __invoke($data, array $dataForView = [])
    {
        if (is_array($data)) {
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
