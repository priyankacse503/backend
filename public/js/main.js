const rzpbutton = document.getElementById("rzp-button1");
const addexpense = document.getElementById("addexpense");
const forgotPassword = document.getElementById("paswdresetbtn");
const token = localStorage.getItem('token');
const currentpagebtn=document.getElementById('currentPage');
const prevpagebtn=document.getElementById('prevPage');
const nextpagebtn=document.getElementById('nextPage');
const noiteminpage=document.getElementById('noiteminpage');
const completedownloadbtn=document.getElementById('completedownloadbtn');

let currentPage=1;
let hasMoreExpenses;
let hasPreviousExpenses;
let noitem=5;

domload();

async function purchasepremium() {
    try {
        
        const Response = await axios.get(`purchase/premiummembership`, { headers: { "Authorization": token } })
        console.log(Response);
        const { key_id, orderid } = Response.data;
        var options = {
            "key": key_id,
            "order_id": orderid,
            "handler": async function (response) {
                await axios.post(`purchase/updatetransactionstatus`, {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id,
                }, { headers: { "Authorization": token } })
                alert('You are a Premium User Now')
            },
        };
        var rzp1 = new Razorpay(options);
        rzp1.open();
        e.preventDefault();
        rzp1.on('payment.failed', function (response) {
            console.log(response);
            alert('Something went wrong Transaction failed');

        });

    } catch (error) {
        console.log(error);

    }
}
rzpbutton.addEventListener("click", (e) => {
    e.preventDefault();
    purchasepremium()
})

addexpense.addEventListener("click", (e) => {
    e.preventDefault();
    if (document.getElementById("amount").value == '' || document.getElementById("description").value == '' || document.getElementById("category").value == '') {
        alert("Enter all Fields");
    }
    else {
        const amount = document.getElementById("amount").value
        const description = document.getElementById("description").value
        const category = document.getElementById("category").value

        const object = {
            amount: amount,
            description: description,
            category: category,

        }
        addExpenseHandler(object);
    }
    document.getElementById('amount').value = '';
    document.getElementById("description").value = '';
    document.getElementById("category").value = '';
})

async function addExpenseHandler(object) {
    try {
        const Response = await axios.post(`expense/addexpense`, object, { headers: { "Authorization": token } })
        alert(Response.data.message);
        domload()
    }
    catch (error) {
        //console.log(error)
        document.body.innerHTML = "<h3>Something went wrong<h3>"
    }
}

async function deleteHandler(id) {
    try {
        const Response = await axios.delete(`expense/deleteexpense/${id}`, { headers: { "Authorization": token } });
        console.log(Response.data.message)
        domload();

    }
    catch (err) {
        document.body.innerHTML = document.body.innerHTML + "<h3>Something went wrong </h3>";
        console.log(err)
    }
}
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function premiumMessage() {
    document.getElementById('rzp-button1').style.visibility = "hidden"
    document.getElementById('message').innerHTML = "You are a Premium User"
    document.getElementById('completedownloadbtn').style.visibility = "show";
    document.getElementById('downloadCard').style.display = "none";
}

function hideMessageCard() {
    // Hide the entire "messageCard" div
    document.getElementById('messageCard').style.display = "none";
    document.getElementById('downloadmessage').innerHTML="Buy premium to Explore premium Features";
    document.getElementById('completedownloadbtn').style.visibility = "hidden"

}
 const showExpenseOnScreen = async (object) => {

    const placeholder = document.querySelector('#placeholder');
    placeholder.innerHTML = "";
    document.querySelector('#totalPlaceholder').innerHTML = `₹ ${object.totalexpenses}`;
    hasMoreExpenses=object.hasMoreExpenses;
    hasPreviousExpenses=object.hasPreviousExpenses;

    if(object.allExpenses.length > 0){
        object.allExpenses.forEach((ele, index) => {

            //To get rupee symbol &#8377 (OR) Alt+R and Alt+4
            const htmlText = `
    <tr key={index}>
   
        <td>₹ ${ele.amount} </td>
        <td>${ele.description}</td>
        <td>${ele.category}</td>      
        <td>  
            <button onclick=deleteHandler('${ele.id}') class="btn btn-danger ms-2" id=${ele.id} data-bs-toggle="button">Delete Expense</button>             
        </td>         
     </tr>`;
            placeholder.innerHTML += htmlText;
        })
        const lastData=object.allExpenses[object.allExpenses.length -1];
        document.querySelector('#lupdatePlaceholder').innerHTML= lastData;
    }
   else{
    placeholder.innerHTML=`No Expense data Present`;
   }
}

function updatePageNumber() { 
    console.log("Updating page number to:", currentPage);
    $('#currentPage').text(currentPage);
    $('#prevPage').prop('disabled', !hasPreviousExpenses);
    $('#nextPage').prop('disabled', !hasMoreExpenses); 
  }
  
  function onclickprevpage() {
    if (hasPreviousExpenses) {
      console.log("Going to previous page...");
      currentPage--;
      domload();
    }
  }
  
  function onclicknextpage() {
  
    if (hasMoreExpenses) { 
      console.log("Going to next page...");
      currentPage++;
      console.log('hasMoreExpenses', hasMoreExpenses);
      console.log('currentPage-----', currentPage);
      domload();
    }
  }
  
  function onSelectnoitem() {
    noitem = document.getElementById('noiteminpage').value;
    currentPage = 1;
    domload();
  }
  
  prevpagebtn.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('previous button clicked'); 
    onclickprevpage();
  });
  
  nextpagebtn.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Next button clicked'); 
    onclicknextpage();
  });
  
  noiteminpage.addEventListener('change', (e) => {
    e.preventDefault();
    console.log('noitem button clicked'); 
    onSelectnoitem();
  });
  
async function domload() {
    const decodeToken = parseJwt(token);
    console.log("decodeToken ----", decodeToken)
    const ispremium = decodeToken.ispremiumuser;
  
    if (ispremium) {
         premiumMessage()
    }
    else {
        hideMessageCard();
    }
    try {
        const Response = await axios.get(`expense/getexpenses?page=${currentPage}&noitem=${noitem}`, { headers: { "Authorization": token } })
        showExpenseOnScreen(Response.data)
        updatePageNumber();
    }
    catch (error) {
        if (error.Response && error.Response.status === 401) {
            console.log(error);
            alert(error.Response.data.message);    
        } else {
            console.log(error);
            alert("Something went wrong please log in again");
        }
    }
}
