terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

# Provider: bucket S3 in Ireland
provider "aws" {
  region = "eu-west-1"
  default_tags {
    tags = {
      Project   = "portfolio"
      ManagedBy = "terraform"
    }
  }
}

# Provider: CloudFront certifications in us-east-1 
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}