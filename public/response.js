let responses = {

    missingParam: (fields) => {

        let res = {
            status: "error",
            status_code: "203",
            message: "invalid data",
            required_field: fields.toString()
        };
        return res;
    },

    error: (code, msg) => {

        let res = {
            status: "error",
            status_code: code,
            message: msg,
        };
        return res;
    },

    success: (msg, result = null) => {

        let res = {
            status: "success",
            status_code: "200",
            message: msg
        };
        if (result) res['result'] = result;
        return res;
    },

    created: (msg, result = null) => {

        let res = {
            status: "success",
            status_code: "201",
            message: msg
        };
        if (result) res['result'] = result;
        return res;
    }

}

module.exports = responses;
