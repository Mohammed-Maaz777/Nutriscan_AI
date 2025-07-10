import React, { useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const BarcodeScanner = ({ onScanSuccess }) => {
  useEffect(() => {
    const scannerId = "reader";

    const html5QrCode = new Html5Qrcode(scannerId);

    Html5Qrcode.getCameras().then((devices) => {
      if (devices && devices.length) {
        const cameraId = devices[0].id;
        html5QrCode.start(
          cameraId,
          {
            fps: 10,
            qrbox: 250,
          },
          (decodedText) => {
            onScanSuccess(decodedText); // call the parent with result
            html5QrCode.stop();
          },
          (errorMessage) => {
            // console.log("Scanning error:", errorMessage);
          }
        );
      }
    });

    return () => {
      html5QrCode.stop().catch(() => {});
    };
  }, [onScanSuccess]);

  return (
    <div>
      <h2 className="font-semibold mb-2">Scan Barcode:</h2>
      <div id="reader" style={{ width: '100%' }}></div>
    </div>
  );
};

export default BarcodeScanner;
