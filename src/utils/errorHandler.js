export const handleError = (res, error, status = 500) => {
    res.status(status).json({ message: error.message || "Internal Server Error" });
};
