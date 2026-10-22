"""Restrict PDF markup to formatting; never resolve input as an image or link."""
from html import escape
from html.parser import HTMLParser
from reportlab.platypus import Paragraph as ReportLabParagraph

class _FormattingOnly(HTMLParser):
    allowed = {"b", "strong", "i", "em", "u", "br", "sup", "sub"}
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
    def handle_starttag(self, tag, attrs):
        self.parts.append(("<br/>" if tag == "br" else "<" + tag + ">") if tag in self.allowed else escape(self.get_starttag_text()))
    def handle_endtag(self, tag):
        if tag in self.allowed and tag != "br":
            self.parts.append("</" + tag + ">")
    def handle_data(self, data):
        self.parts.append(escape(data))

class SafeParagraph(ReportLabParagraph):
    def __init__(self, text, *args, **kwargs):
        parser = _FormattingOnly()
        parser.feed(str(text or ""))
        parser.close()
        super().__init__("".join(parser.parts), *args, **kwargs)

