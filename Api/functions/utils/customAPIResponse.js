const customResponseExito = (data) => {
    return {
        "status": "ok",
        "status_code": 200,
        "data": data
    }
}

const customResponseError = (message, status_code) => {
    return {
        "status": "error",
        "status_code": status_code,
        "message": message
    }
}

module.exports = {
    customResponseError,
    customResponseExito
}