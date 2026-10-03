import {
  to = aws_s3_bucket.portfolio
  id = "atomlab-portfolio"
}

resource "aws_s3_bucket" "portfolio" {
  bucket = "atomlab-portfolio"
}