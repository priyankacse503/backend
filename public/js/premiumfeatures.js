
const leaderboarddata = document.getElementById("leaderboardbtn");
const lbplaceholderdata=document.getElementById("lbplaceholder");
const completedownload = document.querySelector('#completedownloadbtn');
const historyplaceholderdata = document.querySelector('#historyplaceholder');
const downloadhistorydata = document.getElementById("downloadhistorybtn");
completedownload.addEventListener('click', downloadData);
let leaderbtn = false;
let historybtn=false;

premium();

function showLeaderboard(data) {
    if (leaderbtn) {
        lbplaceholderdata.innerHTML = "";
        data.forEach((ele, index) => {
            if (index < 25) {
                const firstName = ele.name.split(' ')[0];
                const li = document.createElement('li');
                li.className = "list-group-item text-nowrap"
                const text = `${index + 1}. ${firstName} - Expense: ₹ ${ele.totalExpenses}`;
                li.innerHTML = text;
                lbplaceholderdata.appendChild(li);
            }
        })

    } else {
        lbplaceholderdata.innerHTML = "";
    }
}

leaderboarddata.addEventListener("click", (e) => {
    e.preventDefault();
    leaderbtn = !leaderbtn
    premium()
})

downloadhistorydata.addEventListener("click", (e) => {
    e.preventDefault();
    historybtn = !historybtn
    premium()
}) 
function showDownloadhistory(data) {

    if (data.length > 0 && historybtn) {
        historyplaceholderdata.innerHTML = "";
        data.forEach((ele, index) => {
            if (index < 25) {
                const date = new Date(ele.createdAt).toLocaleString();
                const a = document.createElement('a');
                a.className = "list-group-item text-nowrap";
                a.href = `${ele.downloadUrl}`
                a.innerHTML = `Downloaded on ${date}`;
                historyplaceholderdata.appendChild(a);
            }

        })
    }
    else{
        historyplaceholderdata.innerHTML = "";
    }
}

async function downloadData(e) {
    try {

        e.preventDefault();
        let response = await axios.get(`premium/download`, { headers: { "Authorization": token } });
        // console.log(response);
        window.location.href = response.data.fileURl;
        premium();
    } catch (error) {
        console.log(error);
        alert(error.response.data.message);
    }
}

async function premium() {
    try {
        const token = localStorage.getItem('token');
        const leaderboard = await axios.get(`premium/leaderboarddata`, { headers: { "Authorization": token } })
        showLeaderboard(leaderboard.data);
        const downloadhistory = await axios.get('premium/downloadhistory', { headers: { "Authorization": token } });
        showDownloadhistory(downloadhistory.data);
    } catch (error) {
        console.log(error);
    }
}