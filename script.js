/*SETTINGS*/

const MATCH_DURATION = 10 * 60;


/*TEAMS*/

const teams = [
    "Lag Lost and Found",
    "Lag Colorama",
    "Lag Discotek",
    "Lag Tomtenissarna",
    "Lag Beachboys"
];


/*GROUP MATCHES*/

const matches = [
    {
        id: "1",
        team1: "Lag Lost and Found",
        team2: "Lag Colorama",
        score: ""
    },
    {
        id: "2",
        team1: "Lag Discotek",
        team2: "Lag Tomtenissarna",
        score: ""
    },
    {
        id: "3",
        team1: "Lag Beachboys",
        team2: "Lag Lost and Found",
        score: ""
    },
    {
        id: "4",
        team1: "Lag Colorama",
        team2: "Lag Discotek",
        score: ""
    },
    {
        id: "5",
        team1: "Lag Tomtenissarna",
        team2: "Lag Beachboys",
        score: ""
    },
    {
        id: "6",
        team1: "Lag Lost and Found",
        team2: "Lag Tomtenissarna",
        score: ""
    },
    {
        id: "7",
        team1: "Lag Colorama",
        team2: "Lag Beachboys",
        score: ""
    },
    {
        id: "8",
        team1: "Lag Discotek",
        team2: "Lag Beachboys",
        score: ""
    },
    {
        id: "9",
        team1: "Lag Colorama",
        team2: "Lag Tomtenissarna",
        score: ""
    },
    {
        id: "10",
        team1: "Lag Lost and Found",
        team2: "Lag Discotek",
        score: ""
    }
];


/*PLAYOFF STATE*/

const playoffState = {

    semi1: {
        team1: "",
        team2: "",
        score1: null,
        score2: null,
        winner: ""
    },

    semi2: {
        team1: "",
        team2: "",
        score1: null,
        score2: null,
        winner: ""
    },

    final: {
        team1: "",
        team2: "",
        score1: null,
        score2: null,
        winner: ""
    }

};


/*TIMER STATE*/

let timerInterval = null;

let timerSeconds = MATCH_DURATION;

let timerRunning = false;

let timerStage = null;

let timerMatchId = null;


/*INITIALIZE*/

document.addEventListener("DOMContentLoaded", () => {

    renderAll();

});


/*GET CURRENT GROUP MATCH*/

function getCurrentMatch() {

    return matches.find(match => !match.score);

}


/*CHECK GROUP COMPLETE*/

function isGroupStageComplete() {

    return matches.every(match => match.score);

}


/*STANDINGS*/

function calculateStandings() {

    const standings = {};

    teams.forEach(team => {

        standings[team] = {

            team,

            played: 0,

            wins: 0,

            draws: 0,

            losses: 0,

            goalsFor: 0,

            goalsAgainst: 0,

            points: 0

        };

    });


    matches.forEach(match => {

        if (!match.score) {
            return;
        }


        const parts = match.score.split("-");

        if (parts.length !== 2) {
            return;
        }


        const score1 = Number(parts[0]);

        const score2 = Number(parts[1]);


        if (
            Number.isNaN(score1) ||
            Number.isNaN(score2)
        ) {
            return;
        }


        const team1 = standings[match.team1];
        const team2 = standings[match.team2];


        if (!team1 || !team2) {
            return;
        }


        team1.played++;
        team2.played++;


        team1.goalsFor += score1;
        team1.goalsAgainst += score2;

        team2.goalsFor += score2;
        team2.goalsAgainst += score1;


        if (score1 > score2) {

            team1.wins++;
            team2.losses++;

            team1.points += 3;

        } else if (score2 > score1) {

            team2.wins++;
            team1.losses++;

            team2.points += 3;

        } else {

            team1.draws++;
            team2.draws++;

            team1.points++;
            team2.points++;

        }

    });


    return Object.values(standings).sort((a, b) => {

        if (b.points !== a.points) {
            return b.points - a.points;
        }


        const goalDifferenceA =
            a.goalsFor - a.goalsAgainst;

        const goalDifferenceB =
            b.goalsFor - b.goalsAgainst;


        if (goalDifferenceB !== goalDifferenceA) {
            return goalDifferenceB - goalDifferenceA;
        }


        return b.goalsFor - a.goalsFor;

    });

}


/*RENDER EVERYTHING*/

function renderAll() {

    renderStandings();

    renderMatches();

    renderCurrentMatch();

    renderPlayoffOverview();

}


/*RENDER STANDINGS*/

function renderStandings() {

    const tbody =
        document.getElementById("standings-body");

    if (!tbody) {
        return;
    }


    const standings = calculateStandings();


    tbody.innerHTML = "";


    standings.forEach((team, index) => {

        const row = document.createElement("tr");


        row.innerHTML = `
            <td class="position-cell">
                ${index + 1}
            </td>

            <td class="team-name">
                ${escapeHtml(team.team)}
            </td>

            <td>
                ${team.played}
            </td>

            <td>
                ${team.wins}
            </td>

            <td>
                ${team.draws}
            </td>

            <td>
                ${team.losses}
            </td>

            <td>
                ${team.goalsFor}
            </td>

            <td>
                ${team.goalsAgainst}
            </td>

            <td>
                ${team.goalsFor - team.goalsAgainst}
            </td>

            <td class="points-cell">
                ${team.points}
            </td>
        `;


        tbody.appendChild(row);

    });

}


/*RENDER GROUP MATCHES*/

function renderMatches() {

    const tbody =
        document.getElementById("matches-body");

    if (!tbody) {
        return;
    }


    const currentMatch = getCurrentMatch();


    tbody.innerHTML = "";


    matches.forEach((match, index) => {

        const row = document.createElement("tr");


        let result = "—";

        let statusClass = "waiting";

        let statusText = "Väntar";


        if (match.score) {

            result = match.score;

            statusClass = "done";

            statusText = "Klar";

        } else if (
            currentMatch &&
            currentMatch.id === match.id
        ) {

            statusClass = "next";

            statusText = "Pågår";

            row.classList.add("current-row");

        }


        row.innerHTML = `
            <td>
                <strong>
                    Match ${index + 1}
                </strong>
            </td>

            <td>
                ${escapeHtml(match.team1)}
                <span style="color: rgba(255,255,255,.3);">
                    –
                </span>
                ${escapeHtml(match.team2)}
            </td>

            <td>
                <strong>${result}</strong>
            </td>

            <td>
                <span class="status ${statusClass}">
                    ${statusText}
                </span>
            </td>
        `;


        tbody.appendChild(row);

    });

}


/*CURRENT MATCH*/

function renderCurrentMatch() {

    const card =
        document.getElementById("current-match-card");

    if (!card) {
        return;
    }


    const groupMatch = getCurrentMatch();


    /*
     * 1. Gruppspel
     */

    if (groupMatch) {

        renderCurrentGroupMatch(groupMatch);

        return;

    }


    /*
     * Gruppspel klart → skapa slutspel
     */

    if (isGroupStageComplete()) {

        setupAutomaticPlayoffs();

    }


    /*
     * 2. Semifinal 1
     */

    if (
        playoffState.semi1.team1 &&
        playoffState.semi1.team2 &&
        !playoffState.semi1.winner
    ) {

        renderCurrentSemiMatch(1);

        return;

    }


    /*
     * 3. Semifinal 2
     */

    if (
        playoffState.semi2.team1 &&
        playoffState.semi2.team2 &&
        !playoffState.semi2.winner
    ) {

        renderCurrentSemiMatch(2);

        return;

    }


    /*
     * 4. Final
     */

    if (
        playoffState.final.team1 &&
        playoffState.final.team2 &&
        !playoffState.final.winner
    ) {

        renderCurrentFinal();

        return;

    }


    /*
     * 5. Turnering klar
     */

    if (playoffState.final.winner) {

        renderTournamentFinished();

        return;

    }


    card.innerHTML = `
        <div class="empty-state">
            Turneringen är redo att starta.
        </div>
    `;

}


/*RENDER CURRENT GROUP MATCH*/

function renderCurrentGroupMatch(match) {

    const card =
        document.getElementById("current-match-card");

    if (!card) {
        return;
    }


    if (
        timerStage !== "group" ||
        timerMatchId !== match.id
    ) {

        stopTimer();

        timerStage = "group";

        timerMatchId = match.id;

        timerSeconds = MATCH_DURATION;

        timerRunning = false;

    }


    const timerText =
        formatTime(timerSeconds);


    const timerFinished =
        timerSeconds <= 0;


    card.innerHTML = `
        <div class="current-match-top">

            <div class="current-match-badge">
                ● GRUPPSPEL
            </div>

            <div class="match-number">
                Match ${getMatchNumber(match)}
                / ${matches.length}
            </div>

        </div>


        <div class="current-match-teams">

            <div class="current-team">
                ${escapeHtml(match.team1)}
            </div>

            <div class="current-vs">
                VS
            </div>

            <div class="current-team">
                ${escapeHtml(match.team2)}
            </div>

        </div>


        <div
            class="current-match-timer ${timerFinished ? "finished" : ""}"
        >
            ${timerText}
        </div>


        <div class="timer-label">
            ${timerFinished
                ? "TIDEN ÄR SLUT"
                : "MATCHTID"
            }
        </div>


        ${
            timerFinished
                ? renderGroupResultForm(match)
                : renderGroupTimerButtons()
        }
    `;

}


/*GROUP TIMER BUTTONS*/

function renderGroupTimerButtons() {

    if (timerRunning) {

        return `
            <div class="current-match-actions">

                <button
                    class="secondary-button"
                    onclick="pauseCurrentTimer()"
                >
                    ⏸ PAUSA MATCH
                </button>

            </div>
        `;

    }


    return `
        <div class="current-match-actions">

            <button
                class="primary-button"
                onclick="startCurrentTimer()"
            >
                ▶ STARTA MATCH
            </button>

        </div>
    `;

}


/*GROUP RESULT FORM*/

function renderGroupResultForm(match) {

    return `
        <div class="result-form">

            <div class="result-title">
                FYLL I SLUTRESULTAT
            </div>

            <div class="score-inputs">

                <input
                    id="score-team1"
                    class="score-input"
                    type="number"
                    min="0"
                    max="99"
                    inputmode="numeric"
                    placeholder="0"
                >

                <div class="score-separator">
                    –
                </div>

                <input
                    id="score-team2"
                    class="score-input"
                    type="number"
                    min="0"
                    max="99"
                    inputmode="numeric"
                    placeholder="0"
                >

            </div>


            <button
                class="save-button"
                onclick="saveCurrentGroupResult()"
            >
                SPARA RESULTAT
            </button>

        </div>
    `;

}


/*START GROUP TIMER*/

function startCurrentTimer() {

    if (timerRunning) {
        return;
    }


    if (timerSeconds <= 0) {
        return;
    }


    timerRunning = true;


    clearInterval(timerInterval);


    timerInterval = setInterval(() => {

        timerSeconds--;


        if (timerSeconds <= 0) {

            timerSeconds = 0;

            timerRunning = false;

            clearInterval(timerInterval);

            renderCurrentMatch();

            return;

        }


        updateTimerOnly();

    }, 1000);


    renderCurrentMatch();

}


/*PAUSE TIMER*/

function pauseCurrentTimer() {

    timerRunning = false;

    clearInterval(timerInterval);

    renderCurrentMatch();

}


/*UPDATE TIMER ONLY*/

function updateTimerOnly() {

    const timerElement =
        document.querySelector(
            ".current-match-timer"
        );


    if (!timerElement) {
        return;
    }


    timerElement.textContent =
        formatTime(timerSeconds);


    if (timerSeconds <= 0) {

        timerElement.classList.add("finished");

    }

}


/*SAVE GROUP RESULT*/

function saveCurrentGroupResult() {

    const match = getCurrentMatch();

    if (!match) {
        return;
    }


    const score1Input =
        document.getElementById("score-team1");

    const score2Input =
        document.getElementById("score-team2");


    if (!score1Input || !score2Input) {
        return;
    }


    const score1 =
        Number(score1Input.value);

    const score2 =
        Number(score2Input.value);


    if (
        score1Input.value === "" ||
        score2Input.value === ""
    ) {

        alert("Fyll i båda resultaten.");

        return;

    }


    if (
        Number.isNaN(score1) ||
        Number.isNaN(score2) ||
        score1 < 0 ||
        score2 < 0
    ) {

        alert("Ange giltiga resultat.");

        return;

    }


    match.score =
        `${score1}-${score2}`;


    stopTimer();


    timerStage = null;

    timerMatchId = null;

    timerSeconds = MATCH_DURATION;


    renderAll();


    /*
     * Om alla gruppmatcher är klara:
     * skapa slutspelet direkt.
     */

    if (isGroupStageComplete()) {

        setupAutomaticPlayoffs();

        renderAll();

    }

}


/*AUTOMATIC PLAYOFFS*/

function setupAutomaticPlayoffs() {

    const standings =
        calculateStandings();


    if (standings.length < 4) {
        return;
    }


    const first =
        standings[0].team;

    const second =
        standings[1].team;

    const third =
        standings[2].team;

    const fourth =
        standings[3].team;


    /*
     * Semifinal 1
     * 1:a vs 4:a
     */

    playoffState.semi1.team1 = first;

    playoffState.semi1.team2 = fourth;


    /*
     * Semifinal 2
     * 2:a vs 3:a
     */

    playoffState.semi2.team1 = second;

    playoffState.semi2.team2 = third;


    /*
     * Finalens lag sätts senare:
     * vinnare semifinal 1
     * mot vinnare semifinal 2
     */

    renderPlayoffOverview();

}


/*RENDER SEMIFINAL*/

function renderCurrentSemiMatch(number) {

    const card =
        document.getElementById("current-match-card");


    const semi =
        number === 1
            ? playoffState.semi1
            : playoffState.semi2;


    if (
        timerStage !== `semi${number}`
    ) {

        stopTimer();

        timerStage = `semi${number}`;

        timerMatchId = null;

        timerSeconds = MATCH_DURATION;

        timerRunning = false;

    }


    const timerFinished =
        timerSeconds <= 0;


    card.innerHTML = `
        <div class="current-match-top">

            <div class="current-match-badge">
                🏆 SEMIFINAL ${number}
            </div>

            <div class="match-number">
                SLUTSPEL
            </div>

        </div>


        <div class="current-match-teams">

            <div class="current-team">
                ${escapeHtml(semi.team1)}
            </div>

            <div class="current-vs">
                VS
            </div>

            <div class="current-team">
                ${escapeHtml(semi.team2)}
            </div>

        </div>


        <div
            class="current-match-timer ${timerFinished ? "finished" : ""}"
        >
            ${formatTime(timerSeconds)}
        </div>


        <div class="timer-label">
            ${
                timerFinished
                    ? "TIDEN ÄR SLUT"
                    : "MATCHTID"
            }
        </div>


        ${
            timerFinished
                ? renderPlayoffResultForm(
                    "semi",
                    number
                )
                : renderPlayoffTimerButtons(number)
        }
    `;

}


/*PLAYOFF TIMER BUTTONS*/

function renderPlayoffTimerButtons(number) {

    if (timerRunning) {

        return `
            <div class="current-match-actions">

                <button
                    class="secondary-button"
                    onclick="pauseCurrentTimer()"
                >
                    ⏸ PAUSA MATCH
                </button>

            </div>
        `;

    }


    const label =
        timerSeconds === MATCH_DURATION
            ? `▶ STARTA SEMIFINAL ${number}`
            : `▶ FORTSÄTT SEMIFINAL ${number}`;


    return `
        <div class="current-match-actions">

            <button
                class="primary-button"
                onclick="startCurrentTimer()"
            >
                ${label}
            </button>

        </div>
    `;

}


/*RENDER PLAYOFF RESULT FORM*/

function renderPlayoffResultForm(type, number) {

    return `
        <div class="result-form">

            <div class="result-title">
                FYLL I SLUTRESULTAT
            </div>

            <div class="score-inputs">

                <input
                    id="playoff-score1"
                    class="score-input"
                    type="number"
                    min="0"
                    max="99"
                    inputmode="numeric"
                    placeholder="0"
                >

                <div class="score-separator">
                    –
                </div>

                <input
                    id="playoff-score2"
                    class="score-input"
                    type="number"
                    min="0"
                    max="99"
                    inputmode="numeric"
                    placeholder="0"
                >

            </div>


            <button
                class="save-button"
                onclick="savePlayoffResult('${type}', ${number})"
            >
                SPARA RESULTAT
            </button>

        </div>
    `;

}


/*SAVE SEMIFINAL RESULT*/

function savePlayoffResult(type, number) {

    const score1Input =
        document.getElementById("playoff-score1");

    const score2Input =
        document.getElementById("playoff-score2");


    if (!score1Input || !score2Input) {
        return;
    }


    if (
        score1Input.value === "" ||
        score2Input.value === ""
    ) {

        alert("Fyll i båda resultaten.");

        return;

    }


    const score1 =
        Number(score1Input.value);

    const score2 =
        Number(score2Input.value);


    if (
        Number.isNaN(score1) ||
        Number.isNaN(score2) ||
        score1 < 0 ||
        score2 < 0
    ) {

        alert("Ange giltiga resultat.");

        return;

    }


    if (score1 === score2) {

        alert(
            "Semifinalen kan inte sluta oavgjort. Ange vinnande resultat."
        );

        return;

    }


    const semi =
        number === 1
            ? playoffState.semi1
            : playoffState.semi2;


    semi.score1 = score1;

    semi.score2 = score2;


    semi.winner =
        score1 > score2
            ? semi.team1
            : semi.team2;


    stopTimer();

    timerStage = null;

    timerMatchId = null;

    timerSeconds = MATCH_DURATION;


    /*
     * När semifinal 1 är klar:
     * dess vinnare går till final.
     */

    if (number === 1) {

        playoffState.final.team1 =
            semi.winner;

    }


    /*
     * När semifinal 2 är klar:
     * dess vinnare går till final.
     */

    if (number === 2) {

        playoffState.final.team2 =
            semi.winner;

    }


    renderAll();

}


/*RENDER FINAL*/

function renderCurrentFinal() {

    const card =
        document.getElementById("current-match-card");


    const final =
        playoffState.final;


    if (timerStage !== "final") {

        stopTimer();

        timerStage = "final";

        timerMatchId = null;

        timerSeconds = MATCH_DURATION;

        timerRunning = false;

    }


    const timerFinished =
        timerSeconds <= 0;


    card.innerHTML = `
        <div class="current-match-top">

            <div class="current-match-badge">
                🏆 FINAL
            </div>

            <div class="match-number">
                SISTA MATCHEN
            </div>

        </div>


        <div class="current-match-teams">

            <div class="current-team">
                ${escapeHtml(final.team1)}
            </div>

            <div class="current-vs">
                VS
            </div>

            <div class="current-team">
                ${escapeHtml(final.team2)}
            </div>

        </div>


        <div
            class="current-match-timer ${timerFinished ? "finished" : ""}"
        >
            ${formatTime(timerSeconds)}
        </div>


        <div class="timer-label">
            ${
                timerFinished
                    ? "TIDEN ÄR SLUT"
                    : "FINAL"
            }
        </div>


        ${
            timerFinished
                ? renderFinalResultForm()
                : renderFinalTimerButtons()
        }
    `;

}


/*FINAL TIMER BUTTONS*/

function renderFinalTimerButtons() {

    if (timerRunning) {

        return `
            <div class="current-match-actions">

                <button
                    class="secondary-button"
                    onclick="pauseCurrentTimer()"
                >
                    ⏸ PAUSA FINAL
                </button>

            </div>
        `;

    }


    const label =
        timerSeconds === MATCH_DURATION
            ? "▶ STARTA FINAL"
            : "▶ FORTSÄTT FINAL";


    return `
        <div class="current-match-actions">

            <button
                class="primary-button"
                onclick="startCurrentTimer()"
            >
                ${label}
            </button>

        </div>
    `;

}


/*FINAL RESULT FORM*/

function renderFinalResultForm() {

    return `
        <div class="result-form">

            <div class="result-title">
                FYLL I SLUTRESULTAT
            </div>

            <div class="score-inputs">

                <input
                    id="final-score1"
                    class="score-input"
                    type="number"
                    min="0"
                    max="99"
                    inputmode="numeric"
                    placeholder="0"
                >

                <div class="score-separator">
                    –
                </div>

                <input
                    id="final-score2"
                    class="score-input"
                    type="number"
                    min="0"
                    max="99"
                    inputmode="numeric"
                    placeholder="0"
                >

            </div>


            <button
                class="save-button"
                onclick="saveFinalResult()"
            >
                🏆 SPARA FINALRESULTAT
            </button>

        </div>
    `;

}


/*SAVE FINAL*/

function saveFinalResult() {

    const score1Input =
        document.getElementById("final-score1");

    const score2Input =
        document.getElementById("final-score2");


    if (!score1Input || !score2Input) {
        return;
    }


    if (
        score1Input.value === "" ||
        score2Input.value === ""
    ) {

        alert("Fyll i båda resultaten.");

        return;

    }


    const score1 =
        Number(score1Input.value);

    const score2 =
        Number(score2Input.value);


    if (
        Number.isNaN(score1) ||
        Number.isNaN(score2) ||
        score1 < 0 ||
        score2 < 0
    ) {

        alert("Ange giltiga resultat.");

        return;

    }


    if (score1 === score2) {

        alert(
            "Finalen kan inte sluta oavgjort. Ange vinnande resultat."
        );

        return;

    }


    playoffState.final.score1 =
        score1;

    playoffState.final.score2 =
        score2;


    playoffState.final.winner =
        score1 > score2
            ? playoffState.final.team1
            : playoffState.final.team2;


    stopTimer();

    timerStage = null;

    timerMatchId = null;

    timerSeconds = MATCH_DURATION;


    renderAll();

}


/*TOURNAMENT FINISHED*/

function renderTournamentFinished() {

    const card =
        document.getElementById("current-match-card");


    card.innerHTML = `
        <div class="tournament-finished">

            <div class="trophy">
                🏆
            </div>

            <div class="finished-kicker">
                TURNERINGEN ÄR KLAR
            </div>

            <div class="finished-title">
                VINNARE
            </div>

            <div class="finished-team">
                ${escapeHtml(
                    playoffState.final.winner
                )}
            </div>

        </div>
    `;

}


/*PLAYOFF OVERVIEW*/

function renderPlayoffOverview() {

    const semi1Team1 =
        document.getElementById("semi1-team1");

    const semi1Team2 =
        document.getElementById("semi1-team2");

    const semi2Team1 =
        document.getElementById("semi2-team1");

    const semi2Team2 =
        document.getElementById("semi2-team2");

    const finalTeam1 =
        document.getElementById("final-team1");

    const finalTeam2 =
        document.getElementById("final-team2");


    if (!semi1Team1) {
        return;
    }


    semi1Team1.textContent =
        playoffState.semi1.team1 || "—";

    semi1Team2.textContent =
        playoffState.semi1.team2 || "—";


    semi2Team1.textContent =
        playoffState.semi2.team1 || "—";

    semi2Team2.textContent =
        playoffState.semi2.team2 || "—";


    finalTeam1.textContent =
        playoffState.final.team1 || "—";

    finalTeam2.textContent =
        playoffState.final.team2 || "—";


    const semi1Result =
        document.getElementById("semi1-result");

    const semi2Result =
        document.getElementById("semi2-result");

    const finalResult =
        document.getElementById("final-result");


    if (semi1Result) {

        semi1Result.textContent =
            playoffState.semi1.winner
                ? `Vinnare: ${playoffState.semi1.winner}`
                : "—";

    }


    if (semi2Result) {

        semi2Result.textContent =
            playoffState.semi2.winner
                ? `Vinnare: ${playoffState.semi2.winner}`
                : "—";

    }


    if (finalResult) {

        finalResult.textContent =
            playoffState.final.winner
                ? `Vinnare: ${playoffState.final.winner}`
                : "—";

    }


    /*
     * Markera aktuell slutspelsmatch.
     */

    document
        .getElementById("semi1-card")
        ?.classList.toggle(
            "active",
            !playoffState.semi1.winner &&
            !!playoffState.semi1.team1
        );


    document
        .getElementById("semi2-card")
        ?.classList.toggle(
            "active",
            !!playoffState.semi1.winner &&
            !playoffState.semi2.winner &&
            !!playoffState.semi2.team1
        );


    document
        .getElementById("final-card")
        ?.classList.toggle(
            "active",
            !!playoffState.semi1.winner &&
            !!playoffState.semi2.winner &&
            !playoffState.final.winner &&
            !!playoffState.final.team1
        );

}


/*STOP TIMER*/

function stopTimer() {

    clearInterval(timerInterval);

    timerInterval = null;

    timerRunning = false;

}


/*FORMAT TIME*/

function formatTime(seconds) {

    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        seconds % 60;


    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(remainingSeconds).padStart(2, "0")
    );

}


/*MATCH NUMBER*/

function getMatchNumber(match) {

    return matches.findIndex(
        item => item.id === match.id
    ) + 1;

}


/*COLLAPSIBLE PANELS*/

function togglePanel(panelId, button) {

    const panel =
        document.getElementById(panelId);


    if (!panel) {
        return;
    }


    const isOpen =
        panel.classList.contains("is-open");


    panel.classList.toggle(
        "is-open",
        !isOpen
    );


    button.setAttribute(
        "aria-expanded",
        String(!isOpen)
    );

}


/*ESCAPE HTML*/

function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}