let poll = {};
let voted = false;

function addOption() {
  const container = document.getElementById('options-container');
  const input = document.createElement('input');
  input.className = 'option-input';
  input.placeholder = `Option ${container.children.length + 1}`;
  container.appendChild(input);
}

function createPoll() {
  const question = document.getElementById('poll-question').value.trim();
  const optionInputs = document.querySelectorAll('.option-input');
  const options = [];

  optionInputs.forEach(input => {
    const value = input.value.trim();
    if (value) options.push({ text: value, votes: 0 });
  });

  if (!question || options.length < 2) {
    alert("Enter a question and at least two options.");
    return;
  }

  poll = { question, options };
  localStorage.setItem('livePoll', JSON.stringify(poll));
  renderPoll();
}

function renderPoll() {
  const saved = localStorage.getItem('livePoll');
  if (!saved) return;

  poll = JSON.parse(saved);
  document.getElementById('create-section').style.display = 'none';
  document.getElementById('poll-section').style.display = 'block';

  document.getElementById('question-title').innerText = poll.question;
  const container = document.getElementById('vote-options');
  container.innerHTML = '';

  const totalVotes = poll.options.reduce((acc, o) => acc + o.votes, 0);

  poll.options.forEach((opt, i) => {
    const percent = totalVotes === 0 ? 0 : ((opt.votes / totalVotes) * 100).toFixed(1);
    const bar = document.createElement('div');
    bar.className = 'option-bar';
    bar.innerHTML = `
      <div class="option-fill" style="width: ${percent}%">
        ${opt.text} – ${percent}%
      </div>
    `;

    if (!voted) {
      bar.style.cursor = 'pointer';
      bar.onclick = () => vote(i);
    }

    container.appendChild(bar);
  });
}

function vote(index) {
  if (voted) return;

  poll.options[index].votes += 1;
  voted = true;
  localStorage.setItem('livePoll', JSON.stringify(poll));
  renderPoll();
}

renderPoll();
