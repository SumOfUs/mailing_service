data "aws_caller_identity" "current" {}
variable "apex_function_track_pixel" {}
variable "apex_function_track_url" {}

variable "aws_region" {
  type    = "string"
  default = "us-west-2"
}

resource "aws_api_gateway_rest_api" "mailing_api" {
  name        = "mailing_api"
  description = "Mailing Service API - pixel tracker, url tracker, etc."
}

module "track_pixel_lambda_proxy" {
  source      = "../modules/aws-lambda-proxy"
  rest_api_id = "${aws_api_gateway_rest_api.mailing_api.id}"
  parent_id   = "${aws_api_gateway_rest_api.mailing_api.root_resource_id}"
  path_part   = "pixel"
  http_method = "GET"
  lambda_name = "${var.apex_function_track_pixel}"
  account_id  = "${data.aws_caller_identity.current.account_id}"
  region      = "${var.aws_region}"
  stage       = "dev"

  request_parameters = {
    "method.request.querystring.user_id"    = true
    "method.request.querystring.mailing_id" = true
  }
}

module "track_url_lambda_proxy" {
  source      = "../modules/aws-lambda-proxy"
  rest_api_id = "${aws_api_gateway_rest_api.mailing_api.id}"
  parent_id   = "${aws_api_gateway_rest_api.mailing_api.root_resource_id}"
  path_part   = "urltrack"
  http_method = "GET"
  lambda_name = "${var.apex_function_track_url}"
  account_id  = "${data.aws_caller_identity.current.account_id}"
  region      = "${var.aws_region}"
  stage       = "dev"

  request_parameters = {
    "method.request.querystring.user_id"    = true
    "method.request.querystring.mailing_id" = true
    "method.request.querystring.url"        = true
    "integration.request.ip"                = "context.identity.sourceIp"
  }
}
