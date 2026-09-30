/* Shared quiz widget. Usage:
   <div id="quiz" class="quiz"></div>
   <script src="../assets/quiz.js"></script>
   <script> renderQuiz(document.getElementById("quiz"), { ... }); </script>
   Data: { title, questions: [{ q, options: [{ text, correct, why }] }] }
   Options are shuffled per load so position never leaks the answer. */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function renderQuiz(root, quiz) {
  let score = 0;
  let answered = 0;
  const total = quiz.questions.length;

  const h = document.createElement("h3");
  h.textContent = quiz.title || "Check yourself";
  root.appendChild(h);

  quiz.questions.forEach((question, qi) => {
    const qEl = document.createElement("div");
    qEl.className = "q";
    const label = document.createElement("p");
    label.textContent = (qi + 1) + ". " + question.q;
    qEl.appendChild(label);

    const opts = document.createElement("div");
    opts.className = "opts";
    const why = document.createElement("div");
    why.className = "why";

    shuffle(question.options).forEach((opt) => {
      const b = document.createElement("button");
      b.className = "opt";
      b.textContent = opt.text;
      b.addEventListener("click", () => {
        if (qEl.dataset.done) return;
        qEl.dataset.done = "1";
        answered++;
        if (opt.correct) {
          b.classList.add("correct");
          score++;
        } else {
          b.classList.add("wrong");
          Array.from(opts.children).forEach((sib) => {
            const data = question.options.find((o) => o.text === sib.textContent);
            if (data && data.correct) sib.classList.add("correct");
          });
        }
        why.textContent = opt.why;
        why.classList.add("show");
        if (answered === total) {
          const s = document.createElement("div");
          s.className = "score";
          s.textContent = "Score: " + score + "/" + total +
            (score === total ? " — solid. Move on." : " — re-read the flagged sections, then retake by reloading.");
          root.appendChild(s);
        }
      });
      opts.appendChild(b);
    });

    qEl.appendChild(opts);
    qEl.appendChild(why);
    root.appendChild(qEl);
  });
}
