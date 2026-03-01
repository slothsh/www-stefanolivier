<?php

namespace App\Actions;

use chillerlan\QRCode\Common\EccLevel;
use chillerlan\QRCode\Output\QROutputInterface;
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;
use Illuminate\Support\Facades\Cache;

class GenerateCvPdfQrCode
{
    public function __invoke(): string
    {
        return Cache::remember('qr.cv_pdf', now()->addMonth(), function () {
            $pdfUrl = route('cv.latest.download');

            $options = new QROptions([
                'eccLevel' => EccLevel::H,
                'outputType' => QROutputInterface::GDIMAGE_PNG,
                'imageBase64' => true,
            ]);

            $qrcode = new QRCode($options);

            return $qrcode->render($pdfUrl);
        });
    }
}
