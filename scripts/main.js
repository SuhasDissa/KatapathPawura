const table = document.getElementById("result");
var edited = false;
fetch("https://desertisland.herokuapp.com/", {
    method: 'GET',
    headers: {
        'collection': 'posts'
    }
}).then(data => {
    console.log(data);
    return data.json();
}).then(obj => {
    console.log(obj);
    table.innerHTML = '';
    obj.slice().reverse().forEach(posts => {
        table.innerHTML += '<li onclick="popup(this)"><p class="id" style="display:none;">' + posts._id + '</p><div class="topic">' + decodeUnicode(posts.topic) + '</div><div class="textblock">' + decodeUnicode(posts.content) + '</div></li>'
    });
});

function popup(element) {
    document.getElementById("popup_topic").innerHTML = element.getElementsByClassName("topic")[0].innerHTML;
    document.getElementById("popup").innerHTML = element.getElementsByClassName("textblock")[0].innerHTML;
    document.getElementById("uniqueid").innerHTML = element.getElementsByClassName("id")[0].innerHTML;
    document.getElementById("popuppadding").style.display = "flex";
}

function newpost() {
    document.getElementById("newpostpadding").style.display = "flex";
}

function closepopup() {
    document.getElementById("popuppadding").style.display = "none";
    edited = false;
}

function closenewpost() {
    document.getElementById("newpostpadding").style.display = "none";
    edited = false;
}

function encodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}

function decodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}


function edit() {
    document.getElementById("topic").value = document.getElementById("popup_topic").innerHTML;
    document.getElementById("subject").value = document.getElementById("popup").innerHTML.replaceAll("<br>", "\n");
    document.getElementById("newpostpadding").style.display = "flex";
    closepopup()
    edited = true;
}

function submit() {
    var topic = document.getElementById("topic").value;
    var subject = document.getElementById("subject").value.replaceAll("\n", "<br>");
    if (!topic || !subject) {
        alert("සියලු තොරතුරු පුරවන්න!!")
    } else {
        if (!edited) {
            const postData = {
                topic: encodeUnicode(topic),
                content: encodeUnicode(subject)
            };
            const options = {
                method: 'POST',
                body: JSON.stringify(postData),
                headers: {
                    'Content-Type': 'application/json',
                    'collection': "posts"
                }
            }
            fetch("https://desertisland.herokuapp.com/", options)
                .then(res => res.json())
                .then(res => console.log(res));
            closenewpost();
            alert("පොස්ටුව ඇතුලත් කිරීම සාර්ථකයි.අවශ්‍ය නම් පිටුව reload කරන්න");
        } else {
            var uid = document.getElementById("uniqueid").innerHTML;
            const postData = {
                topic: encodeUnicode(topic),
                content: encodeUnicode(subject)
            };
            const options = {
                method: 'PATCH',
                body: JSON.stringify(postData),
                headers: {
                    'Content-Type': 'application/json',
                    'collection': "posts",
                    'id': uid
                }
            }
            fetch("https://desertisland.herokuapp.com/", options)
                .then(res => res.json())
                .then(res => console.log(res));
            closenewpost();
            alert("පොස්ටුව edit කිරීම සාර්ථකයි.අවශ්‍ය නම් පිටුව reload කරන්න");
        }

    }
}
