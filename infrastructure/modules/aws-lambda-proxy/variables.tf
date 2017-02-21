# API Gateway ID (required)
variable "rest_api_id" {}

# Api Gateway Parent ID (required)
variable "parent_id" {}

# http method (optional)
variable "http_method" {
  type    = "string"
  default = "GET"
}

# Name of Lambda function (required)
variable "lambda_name" {}

# Account ID (required)
variable "account_id" {}

# AWS Region (optional)
variable "region" {
  type    = "string"
  default = "us-west-2"
}

# Request parameters (optional)
variable "request_parameters" {
  type    = "map"
  default = {}
}

# Deployment stage (optional)
variable "stage" {
  type    = "string"
  default = "dev"
}
