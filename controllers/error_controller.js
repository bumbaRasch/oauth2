// controllers/error_controller.js

// error_controller.js
export const error_controller = async (req, res) => {
    res.status(404).send('Not found');
}