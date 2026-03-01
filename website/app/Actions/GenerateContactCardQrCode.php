<?php

namespace App\Actions;

use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;

class GenerateContactCardQrCode {
    public function __invoke(): string {
        $vcard = $this->buildVCard();

        $options = new QROptions([
            'eccLevel' => QRCode::ECC_M,
            'outputType' => QRCode::OUTPUT_IMAGE_PNG,
            'imageBase64' => true,
        ]);

        $qrcode = new QRCode($options);

        return $qrcode->render($vcard);
    }

    private function buildVCard(): string {
        return implode("\r\n", [
            'BEGIN:VCARD',
            'VERSION:3.0',
            'N:Olivier;Stefan;;;',
            'FN:Stefan Olivier',
            'TEL;TYPE=WORK,VOICE:+27761855537',
            'EMAIL:s.olivier1194@gmail.com',
            'URL:https://github.com/slothsh',
            'URL:https://linkedin.com/in/stefan-olivier-628261145',
            'END:VCARD',
        ]);
    }
}
