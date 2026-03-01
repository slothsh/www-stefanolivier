<?php

namespace App\Actions;

use chillerlan\QRCode\Common\EccLevel;
use chillerlan\QRCode\Output\QROutputInterface;
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;

class GenerateContactCardQrCode {
    public function __invoke(): string {
        $vcard = $this->buildVCard();

        $options = new QROptions([
            'eccLevel' => EccLevel::H,
            'outputType' => QROutputInterface::GDIMAGE_PNG,
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
            'URL:https://stefanolivier.com/',
            'URL:https://linkedin.com/in/stefan-olivier-628261145',
            'URL:https://github.com/slothsh',
            'END:VCARD',
        ]);
    }
}
