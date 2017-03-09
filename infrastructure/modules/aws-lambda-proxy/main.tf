resource "aws_api_gateway_resource" "lambda_proxy_resource" {
  rest_api_id = "${var.rest_api_id}"
  parent_id   = "${var.parent_id}"
  path_part   = "${var.path_part}"
}

resource "aws_api_gateway_method" "lambda_proxy_method" {
  rest_api_id        = "${var.rest_api_id}"
  resource_id        = "${aws_api_gateway_resource.lambda_proxy_resource.id}"
  http_method        = "${var.http_method}"
  authorization      = "NONE"
  request_parameters = "${var.request_parameters}"

  depends_on = [
    "aws_api_gateway_resource.lambda_proxy_resource",
  ]
}

resource "aws_api_gateway_integration" "lambda_proxy_integration" {
  rest_api_id             = "${var.rest_api_id}"
  resource_id             = "${aws_api_gateway_resource.lambda_proxy_resource.id}"
  http_method             = "${var.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.region}:lambda:path/2015-03-31/functions/${var.lambda_name}/invocations"

  depends_on = [
    "aws_api_gateway_method.lambda_proxy_method",
  ]
}

resource "aws_lambda_permission" "AllowExecutionFromAPIGateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = "${var.lambda_name}"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.rest_api_id}/*/${var.http_method}/*"
}

resource "aws_api_gateway_deployment" "lambda_proxy_deployment" {
  rest_api_id = "${var.rest_api_id}"
  stage_name  = "${var.stage}"

  depends_on = [
    "aws_api_gateway_integration.lambda_proxy_integration",
  ]
}
