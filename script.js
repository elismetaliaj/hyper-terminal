document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const terminalBody = document.getElementById('terminal-body');

    let commandHistory = [];
    let historyIndex = -1;
    
    // Simulated filesystem
    const filesystem = {
        '/': {}
    };
    let currentDirectory = '/';

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const command = input.value;
            input.value = '';
            commandHistory.push(command);
            historyIndex = commandHistory.length;
            processCommand(command);
        } else if (event.key === 'ArrowUp') {
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[historyIndex];
            }
        } else if (event.key === 'ArrowDown') {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex];
            } else {
                input.value = '';
            }
        }
    });

    function processCommand(command) {
        if (command === 'clear') {
            output.innerHTML = '';
        } else {
            const response = executeCommand(command);
            const commandOutput = document.createElement('div');
            commandOutput.textContent = `> ${command}\n${response}`;
            output.appendChild(commandOutput);
        }
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function executeCommand(command) {
        const parts = command.split(' ');
        const cmd = parts[0];
        const args = parts.slice(1);

        switch (cmd) {
            case 'help':
                return 'Available commands: help, hello, date, clear, mkdir, touch, rm, cp, ls, ,ssh,cd';
            case 'hello':
                return 'Hello, developer!';
            case 'ssh':
                    return 'Type you Ip Server',ip;
            case 'date':
                return new Date().toLocaleString();
            case 'mkdir':
                return mkdir(args);
            case 'touch':
                return touch(args);
            case 'rm':
                return rm(args);
            case 'cp':
                return cp(args);
            case 'ls':
                return ls(args);
            case 'cd':
                return cd(args);
            case 'clear':
                return ''; // This won't be displayed, as handled in processCommand
            default:
                return `Unknown command: ${command}`;
        }
    }

    // async function connect() {
    //     const ip = document.getElementById('ip').value.trim();
    //     if (!ip) {
    //         alert("Please enter an IP address.");
    //         return;
    //     }

    //     const username = prompt("Enter username:");
    //     const password = prompt("Enter password:");

    //     try {
    //         const response = await fetch('/connect', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ ip, username, password })
    //         });
    //         const result = await response.text();
    //         document.getElementById('output').value = result;
    //     } catch (error) {
    //         console.error('Error:', error);
    //         alert('An error occurred. Please try again.');
    //     }
    // }

    function mkdir(args) {
        if (args.length === 0) return 'mkdir: missing operand';
        const dir = args[0];
        const fullPath = getFullPath(dir);
        if (fullPath in filesystem) return `mkdir: cannot create directory ‘${dir}’: File exists`;
        filesystem[fullPath] = {};
        return '';
    }

    function touch(args) {
        if (args.length === 0) return 'touch: missing operand';
        const file = args[0];
        const fullPath = getFullPath(file);
        const dir = getDir(fullPath);
        if (!(dir in filesystem)) return `touch: cannot touch ‘${file}’: No such file or directory`;
        filesystem[dir][getName(fullPath)] = '';
        return '';
    }

    function rm(args) {
        if (args.length === 0) return 'rm: missing operand';
        const file = args[0];
        const fullPath = getFullPath(file);
        const dir = getDir(fullPath);
        if (!(dir in filesystem) || !(getName(fullPath) in filesystem[dir])) return `rm: cannot remove ‘${file}’: No such file or directory`;
        delete filesystem[dir][getName(fullPath)];
        return '';
    }

    function cp(args) {
        if (args.length < 2) return 'cp: missing file operand';
        const src = args[0];
        const dest = args[1];
        const srcPath = getFullPath(src);
        const destPath = getFullPath(dest);
        const srcDir = getDir(srcPath);
        const destDir = getDir(destPath);
        if (!(srcDir in filesystem) || !(getName(srcPath) in filesystem[srcDir])) return `cp: cannot stat ‘${src}’: No such file or directory`;
        if (!(destDir in filesystem)) return `cp: cannot create regular file ‘${dest}’: No such file or directory`;
        filesystem[destDir][getName(destPath)] = filesystem[srcDir][getName(srcPath)];
        return '';
    }

    function ls(args) {
        const dir = args.length === 0 ? currentDirectory : getFullPath(args[0]);
        if (!(dir in filesystem)) return `ls: cannot access ‘${args[0]}’: No such file or directory`;
        return Object.keys(filesystem[dir]).join(' ');
    }

    function cd(args) {
        if (args.length === 0) return 'cd: missing operand';
        const dir = getFullPath(args[0]);
        if (!(dir in filesystem)) return `cd: ${args[0]}: No such file or directory`;
        currentDirectory = dir;
        return '';
    }

    function getFullPath(path) {
        if (path.startsWith('/')) return path;
        if (currentDirectory === '/') return `/${path}`;
        return `${currentDirectory}/${path}`;
    }

    function getDir(path) {
        const parts = path.split('/');
        parts.pop();
        return parts.join('/') || '/';
    }

    function getName(path) {
        const parts = path.split('/');
        return parts.pop();
    }
});
