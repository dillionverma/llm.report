import * as http from "http";
import * as https from "https";

export default function log() {
  override(http);
  override(https);
}

function override(module) {
  let original = module.request;

  function wrapper(outgoing) {
    let req = original.apply(this, arguments);

    let emit = req.emit;
    let responseBody = "";

    let request_body = "";
    let original_write = req.write;
    req.write = function (chunk) {
      request_body += chunk;
      return original_write.apply(this, arguments);
    };

    let original_end = req.end;
    req.end = function (chunk) {
      if (chunk) request_body += chunk;
      return original_end.apply(this, arguments);
    };

    req.emit = function (eventName, response) {
      switch (eventName) {
        case "response": {
          response.on("data", (d) => {
            responseBody += d;
          });

          response.on("end", () => {
            request_logger(outgoing, request_body);
            response_logger(response, responseBody);
          });
        }
      }

      return emit.apply(this, arguments);
    };

    return req;
  }

  function request_logger(req, body) {
    let log = {
      method: req.method || "GET",
      host: req.host || req.hostname || "localhost",
      port: req.port || "443",
      path: req.pathname || req.path || "/",
      headers: req.headers || {},
      body: body || "",
    };
    console.log(log);
  }

  function response_logger(response, body) {
    let res = {
      statusCode: response.statusCode,
      headers: response.headers,
      message: response.statusMessage,
      body: body,
    };
    console.log(res);
  }

  module.request = wrapper;
}
