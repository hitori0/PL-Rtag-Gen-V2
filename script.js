
    const RANKS_BY_TEAM = {
        "Pandora's Observers": [
            { name: "Intern", tier: "LR", level: "L2", health: 125 },
            { name: "Junior Researcher", tier: "LR", level: "L2", health: 125 },
            { name: "Researcher", tier: "LR", level: "L2", health: 125 },
            { name: "Senior Researcher", tier: "MR", level: "L2", health: 125 },
            { name: "Leading Researcher", tier: "MR", level: "L2", health: 125 },
            { name: "Chief Researcher", tier: "MR", level: "L2", health: 125 },
            { name: "Head Researcher", tier: "MR", level: "L2", health: 125 },
            { name: "Professor", tier: "MR", level: "L2", health: 125 },
            { name: "Research Governor", tier: "HR", level: "L3", health: 125 },
            { name: "Board of Research", tier: "HR", level: "L3", health: 125 },
            { name: "Board Director", tier: "HC", level: "L3", health: 150 }
        ],
        "Prometheus Security Force": [
            { name: "Trainee", tier: "LR", level: "L2", health: 125 },
            { name: "Private", tier: "LR", level: "L2", health: 125 },
            { name: "Private First Class", tier: "LR", level: "L2", health: 125 },
            { name: "Specialist", tier: "LR", level: "L2", health: 125 },
            { name: "Corporal", tier: "LR", level: "L2", health: 125 },
            { name: "Sergeant", tier: "MR", level: "L2", health: 150 },
            { name: "Sergeant Second Class", tier: "MR", level: "L2", health: 150 },
            { name: "Sergeant First Class", tier: "MR", level: "L2", health: 150 },
            { name: "Master Sergeant", tier: "MR", level: "L2", health: 150 },
            { name: "Sergeant Major", tier: "MR", level: "L2", health: 150 },
            { name: "Warrant Officer", tier: "MR", level: "L2", health: 150 },
            { name: "Second Lieutenant", tier: "HR", level: "L3", health: 175 },
            { name: "First Lieutenant", tier: "HR", level: "L3", health: 175 },
            { name: "Captain", tier: "HC", level: "L3", health: 200 },
            { name: "Major", tier: "HC", level: "L3", health: 200 }
        ]
    };

    const TEAM_DETAILS = {
        "Pandora's Observers": {
            displayName: "[FGOI] Prometheus Laboratories | Pandora's Observers",
            color: '127 255 212',
            starterItems: 'pistol,clipboard,tablet,authorize'
        },
        "Prometheus Security Force": {
            displayName: "[FGOI] Prometheus Laboratories | Security Force",
            color: 'gray',
            starterItems: 'aa-12,arx-200,shield'
        }
    };

document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const form = document.getElementById('rtagForm');
    const teamSelect = document.getElementById('team');
    const rankSelect = document.getElementById('rank');
    const usernameInput = document.getElementById('username');
    const codenameInput = document.getElementById('codename');
    const bcaCheck = document.getElementById('bca');
    const outputEl = document.getElementById('output');

    function updateRanks() {
        const selectedTeam = teamSelect.value;
        const newRanks = RANKS_BY_TEAM[selectedTeam] || [];

        rankSelect.innerHTML = ''; // Clear existing options

        newRanks.forEach(rankObj => {
            const option = document.createElement('option');
            option.value = rankObj.name;
            option.textContent = rankObj.name;
            rankSelect.appendChild(option);
        });
    }

    function generateTags(username, codename, team, rankName, bca) {
        // Get team-specific details
        const teamDetails = TEAM_DETAILS[team];

        // Get rank-specific details
        const rankList = RANKS_BY_TEAM[team];
        const rankObj = rankList.find(r => r.name === rankName);
        const { tier, level, health } = rankObj;

        // Build an array of commands
        const commands = [];

        // 1. Main rtag 
        let rtag = `permrtag ${username} ${teamDetails.displayName} <br /> [${tier} - ${level}] ${rankName}`;        
        if (bca) {
            rtag += ' | BC:A';
        }
        commands.push(rtag);

        // 2. Codename (optional)
        if (codename) {
            commands.push(`permntag ${username} "${codename}"`);
        }

        // 3. Color
        commands.push(`permcrtag ${username} ${teamDetails.color}`);

        // 4. Starter Gear
        if (team === "Prometheus Security Force" && tier === "HC") {
            commands.push(`startergear ${username} golden,clipboard,tablet,authorize`);
        } else {
            commands.push(`startergear ${username} ${teamDetails.starterItems},${level}`);
        }

        // 5. Health
        commands.push(`permmaxhealth ${username} ${health}`);
        
        // 6. Remove Morph
        if (team === "Prometheus Security Force") {
            commands.push(`permmorph ${username} remove`);
        }

        //7. Morph Appearance
        if (team === "Pandora's Observers") {
            if (rankName === "Board of Research" || rankName === "Board Director") {
                // PO Board of Research or Director morph
                commands.push(`permshirt ${username} 11455930608 11427392983`);
            } else {
                // All other PO ranks morph
                commands.push(`permshirt ${username} 8435120013 8435339348`);
            }
        } else if (team === "Prometheus Security Force") {
            // PSF morph
            commands.push(`permhat ${username} ivest,15330913778,15177437784,15893978296,15177801713,92371339244528,holster,kneepads,12577272243`);
            commands.push(`permshirt ${username} 73972368297165`);
            commands.push(`permpants ${username} 128876333929054`);
        }

        // Join all commands with the separator
        return 'run ' +commands.join(' & ');
    }


    function handleFormSubmit(e) {
        e.preventDefault();

        // Get and trim all values
        const username = usernameInput.value.trim();
        const codenameRaw = codenameInput.value.trim();
        const team = teamSelect.value;
        const rank = rankSelect.value;
        const bca = bcaCheck.checked;

        // Validate username
        if (!username) {
            outputEl.textContent = 'Please enter a username.';
            return;
        }

        // Escape quotes in codename for the command string
        const safeCodename = codenameRaw.replace(/"/g, '\\"');

        // Generate and display the tags
        outputEl.textContent = generateTags(username, safeCodename, team, rank, bca);
    }

    form.addEventListener('submit', handleFormSubmit);
    teamSelect.addEventListener('change', updateRanks);
    updateRanks();
});