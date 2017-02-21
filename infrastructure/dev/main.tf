data "aws_caller_identity" "current" {}
variable "apex_function_track_pixel" {}

variable "aws_region" {
  type    = "string"
  default = "us-west-2"
}

resource "aws_api_gateway_rest_api" "mailing_api" {
  name        = "mailing_api"
  description = "Mailing Service API - pixel tracker, url tracker, etc."
}

resource "aws_api_gateway_resource" "track_pixel" {
  rest_api_id = "${aws_api_gateway_rest_api.mailing_api.id}"
  parent_id   = "${aws_api_gateway_rest_api.mailing_api.root_resource_id}"
  path_part   = "pixel"
}

resource "aws_api_gateway_method" "get_track_pixel" {
  rest_api_id   = "${aws_api_gateway_rest_api.mailing_api.id}"
  resource_id   = "${aws_api_gateway_resource.track_pixel.id}"
  http_method   = "GET"
  authorization = "NONE"

  request_parameters = {
    "method.request.querystring.user_id"    = true
    "method.request.querystring.mailing_id" = true
  }
}

resource "aws_api_gateway_integration" "track_pixel_integration" {
  rest_api_id             = "${aws_api_gateway_rest_api.mailing_api.id}"
  resource_id             = "${aws_api_gateway_resource.track_pixel.id}"
  http_method             = "${aws_api_gateway_method.get_track_pixel.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.aws_region}:lambda:path/2015-03-31/functions/${var.apex_function_track_pixel}/invocations"
}

resource "aws_lambda_permission" "AllowExecutionFromAPIGateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = "${var.apex_function_track_pixel}"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.aws_region}:${data.aws_caller_identity.current.account_id}:${aws_api_gateway_rest_api.mailing_api.id}/*/${aws_api_gateway_method.get_track_pixel.http_method}/*"
}

resource "aws_api_gateway_deployment" "mailing_api_deployment" {
  depends_on  = ["aws_api_gateway_method.get_track_pixel"]
  rest_api_id = "${aws_api_gateway_rest_api.mailing_api.id}"
  stage_name  = "dev"
}
