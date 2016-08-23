"use strict";

function FlowTestClientError(natelPayError) {
	this.natelPayError = natelPayError;
	this.message = natelPayError.error_description;
	this.name = natelPayError.error;
}
FlowTestClientError.prototype = Object.create(Error.prototype);

exports.FlowTestClientError = FlowTestClientError;