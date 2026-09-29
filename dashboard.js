/* =========================================================
   CG-5 DASHBOARD
   ========================================================= */

const SUPABASE_URL =
    "https://qxiufjlserfxgblftieb.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_H0hMUqF1YM5rUT9cdLAqJA_qiQfNznA";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================================================
   LOGOUT
   ========================================================= */

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener("click", async function () {

        try {

            const { error } =
                await supabaseClient.auth.signOut();

            if (error) {

                console.error(
                    "Logout error:",
                    error
                );

                return;
            }

            window.location.href =
                "index.html";

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

        }

    });

}