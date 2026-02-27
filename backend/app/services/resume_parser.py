from typing import Optional
from PyPDF2 import PdfReader
from docx import Document

def extract_text_from_pdf(file_bytes: bytes) -> str:
    reader = PdfReader(io_bytes(file_bytes))
    text_parts = []
    for page in reader.pages:
        text_parts.append(page.extract_text() or "")
    return "\n".join(text_parts).strip()

def extract_text_from_docx(file_bytes: bytes) -> str:
    import io
    f = io.BytesIO(file_bytes)
    doc = Document(f)
    return "\n".join([p.text for p in doc.paragraphs]).strip()

def io_bytes(b: bytes):
    import io
    return io.BytesIO(b)