const translate =
  require("@iamtraction/google-translate");

exports.translateText =
  async (req, res) => {

    try {

      const {
        text,
        target,
      } = req.body;

      if (!text) {

        return res.status(400).json({
          success: false,
          message:
            "Text is required",
        });

      }

      console.log(
        "TEXT:",
        text
        );

        console.log(
        "TARGET:",
        target
        );

      const result =
        await translate(text, {
          to: target || "id",
        });

      return res.json({
        success: true,
        translatedText:
          result.text,
      });

    } catch (error) {

      console.error(
        "TRANSLATE ERROR:",
        error.message
        );

      return res.status(500).json({
        success: false,
        message:
          "Translation failed",
      });

    }

};
