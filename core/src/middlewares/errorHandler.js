/**
 * Единая обработка ошибок Express
 */
export default function errorHandler(err, _req, res, _next) {
    const code = err.status || 500;
    res.status(code).json({
        error: {
            code,
            message: err.message || 'Internal Server Error',
        },
    });
}