from flask import Flask, render_template, request, session, redirect, url_for
import os
import platform

app = Flask(__name__)
app.secret_key = os.urandom(24)

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        grid_size = int(request.form["grid_size"])
        player1 = request.form["player1"].strip()
        player2 = request.form["player2"].strip()

        if 3 <= grid_size <= 6 and player1 and player2:
            session["grid_size"] = grid_size
            session["player1"] = player1
            session["player2"] = player2
            return redirect(url_for("game"))

    return render_template("index.html")

@app.route("/game")
def game():
    return render_template(
        "game.html",
        grid_size=session.get("grid_size", 3),
        player1=session.get("player1", "Player 1"),
        player2=session.get("player2", "Player 2")
    )

if __name__ == "__main__":
    if platform.system() == 'Android':
        from android.permissions import Permission, request_permissions
        request_permissions([Permission.INTERNET, Permission.READ_EXTERNAL_STORAGE, Permission.WRITE_EXTERNAL_STORAGE])
    app.run(debug=False, port=8080)
