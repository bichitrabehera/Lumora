from __future__ import annotations

import io
import base64
import qrcode
from qrcode.constants import ERROR_CORRECT_H


def generate_qr_base64(data: str) -> str:
    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_H,
        box_size=10,
        border=3,
    )
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="#bc535b", back_color="white")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    b = buf.getvalue()
    return base64.b64encode(b).decode("ascii")
