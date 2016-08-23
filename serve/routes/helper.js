exports.getAuthToken = function (clientId, clientSecret) {
    var token = clientId + ':' + clientSecret;
    var hash = new Buffer(token).toString('base64');
    return hash;
};
exports.getAction = function (req) {
    return req.params.action || "register";
};
exports.getSection = function (action) {
    switch (action) {
        case "imsi":
            return "Fraud-Prevention Profil anzeigen";
        case "roaming":
            return "Roaming Status anzeigen";
        case "mobile-type":
            return "Mobile Status anzeigen";
        default:
            return "Funktionen freischalten";
    }
};
