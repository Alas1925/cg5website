export default async function handler(req, res) {

    if (req.method !== "POST") {

        return res.status(405).json({
            error: "Method not allowed"
        });

    }

    try {

        const { question, roster } = req.body || {};

        if (!question) {

            return res.status(400).json({
                error: "Question is required."
            });

        }

        return res.status(200).json({

            answer: "Backend connection test successful."

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            error: "CG-5 AI backend error."

        });

    }

}