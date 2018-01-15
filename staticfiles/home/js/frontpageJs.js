// gobal variable
var isTwoTableVisibile = true;
var FBuserEmail="";

$(document).ready(function()
{
	//window scroll
	 $(window).scroll(windowScroll);

	//tooltip activation
	$('[data-toggle="tooltip"]').tooltip({
		trigger : 'hover'
	});
	//yes btn pressed, hides assignment table
	$("#yesBtn").click(function()
	{
		$( "#assignmentTableDiv" ).hide("slow" );
		setTimeout( function(){
				$("#tableMainDiv").css("margin-left", "30%");
				$("#tableMainDiv").css("float", "none");						
		}, 500 );
		isTwoTableVisibile = false;
	});
	
	//no btn pressed, brings back assignment table
	$("#noBtn").click(function()
	{
		$("#tableMainDiv").css("margin-left", "0%");
		$("#tableMainDiv").css("float", "right");
		$("#assignmentTableDiv").show("slow");
		isTwoTableVisibile = true;
	});
	
	//handles delete button
	$(".assignmentDeleteBtn").click(assignmentDeleteBtnListener);
	

	// hadnles save btn
	$(document).on('click','#saveBtn',function (e){
		if($('#courseName').text().length == 0)
		{
			alert("none");

			$('#courseRegoModal').modal('toggle');
		}
		else
		{
			e.preventDefault();
			var rowNum= $("#assignmentTable tr").length-1;	//gives real number of rows in ass table
			var rowInfo='';
			var i=0;
			for(var i=0;i<rowNum;i++)
			{
				rowInfo+=i+1+",";
				
				if($(".assignmentNameBox").eq(i).val().length != 0)
					rowInfo+=$(".assignmentNameBox").eq(i).val()+",";	
				else
					rowInfo+=",";

				var box=".noBox"+(i+1);
				rowInfo+=$(box).eq(0).val()+",";
				rowInfo+=$(box).eq(1).val()+",";
				rowInfo+=$(box).eq(2).val()+",";
				rowInfo+=$(box).eq(3).val();
				if(i!=rowNum-1)
					rowInfo+="/";
			}

			// get grade table data
			currentGrade= $('#currentGrade').val();
			desiredGrade= $('#desiredGrade').val();
			finalWeight= $('#finalWeight').val();
			finalMark= $('#finalMark').val();
			$("#eg").text(currentGrade);
			$.ajax({
					type:'POST',
					url:'/user/saveAssignment/',
					dataType:'text',
					data:{
						courseName:$('#courseName').text(),
						tableData:rowInfo,
						csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
						totalRow:rowNum,
						currentGrade:currentGrade,
						desiredGrade:desiredGrade,
						finalWeight:finalWeight,
						finalMark:finalMark,
					},
					success: function(data){
							alert('success');
					}
				});
		}	//end else
		
	});




	$(document).on('click','#postCourseBtn',function (e){
		if( $("#courseSubmit").length)
			return;

		e.preventDefault();
		var username = $('#userName').text().trim();
		var courseName=$('#id_courseName').val();
			var rowNum= $("#assignmentTable tr").length-1;	//gives real number of rows in ass table
			var rowInfo='';
			var i=0;
			for(var i=0;i<rowNum;i++)
			{
				rowInfo+=i+1+",";
				
				if($(".assignmentNameBox").eq(i).val().length != 0)
					rowInfo+=$(".assignmentNameBox").eq(i).val()+",";	
				else
					rowInfo+=",";

				var box=".noBox"+(i+1);
				rowInfo+=$(box).eq(0).val()+",";
				rowInfo+=$(box).eq(1).val()+",";
				rowInfo+=$(box).eq(2).val()+",";
				rowInfo+=$(box).eq(3).val();
				if(i!=rowNum-1)
					rowInfo+="/";
			}

			// get grade table data
			currentGrade= $('#currentGrade').val();
			desiredGrade= $('#desiredGrade').val();
			finalWeight= $('#finalWeight').val();
			finalMark= $('#finalMark').val();
			$.ajax({
					type:'POST',
					url:'/user/saveCourseAndAssignment/',
					dataType:'text',
					data:{
						courseName:courseName,
						tableData:rowInfo,
						csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
						totalRow:rowNum,
						currentGrade:currentGrade,
						desiredGrade:desiredGrade,
						finalWeight:finalWeight,
						finalMark:finalMark,
					},
					success: function(response){
						if(response == 'success')
						{
							var url = "http://localhost:8000/user/courseView/"+username+"-"+courseName;
							window.location.replace(url);
						}
						else
						{
							alert("call fail function");
						}
					}
				});
	});



	$(document).on('click','#fbPostSignupBtn',function (e){
		username = $('#id_FBform-username').val();
		alert(username);
		alert(FBuserEmail);
		e.preventDefault();

		$.ajax({
			type:'POST',
			url:'/home/fbSignup/',
			dataType: 'text',
			data:{
				email:FBuserEmail,
				username:username,
				csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
			},
			success: function(response){
				if(response == 'success')
				{
					// alert("success")
					var url = "http://localhost:8000/user/home";
					window.location.replace(url);
				}
				else
				{
					$('#fbSignupDiv').hide();
					$('#fbSigupFooter').hide();
					$('#fbWarningDiv').show();

				}
			}
		});
		// alert("passed ajax");
	});


	$(document).on('click','#fbLoginLink',function (e){
		alert('fb login');
		FBlogin(e);
		// e.preventDefault();

	});
	addListeners();

});



function addListeners(){

	// does ajax post for login
	// addLoginAjaxListener();

	//handles assignment row's weight
	addRowWeigthListener();

	//handles row's Grades and links to their marks in assignment table
	addRowGradeListener();
	
	//handles row marks and fixes grades
	addRowMarksListener();
	
	//checks for click event on addRow btn and adds a new row
	addRowListener();


	// reinitiate all hidden divs and show all shown divs
	$(document).on('click','.close', closeReinitiate );

	$(document).on('click','.modalCancelBtn', closeReinitiate ) ;

}


//checks for click event on addRow btn and adds a new row
function addRowListener()
{
	$("#addRowBtn").click(function(){
		//get total number of rows
		var len = $("#assignmentTable tr").length;
		//add new row
		var str = 
						"<tr>"
							+"<td><b>"+len+"</b></td>"
							+"<td><input class='assignmentNameBox' type='text'></input></td>"
							+"<td><input class='noBox rowMarks noBox"+len+"' type='text'></input><b> / </b><input class='noBox rowMarks noBox"+len+"' type='text' ></input></td>"
							+"<td><input class='noBox rowGrade noBox"+len+"' type='text'  onClick='this.select()'></input></td>"
							+"<td><input class='noBox rowWeight noBox"+len+"' type='text'  onclick='this.select()'></input></td>"
							+"<td><button class='btn btn-danger btn-xs assignmentDeleteBtn' data-title='Delete' data-placement='top' data-toggle='tooltip'><span class='glyphicon glyphicon-trash'></span></button></td>"
						+"</tr>"

		//add new row to table
		$('#assignmentTable').find('tbody:last').append(str);
		//add new, empty element in gradeArr
		gradeArr.push(0);
		var parentName;
		//add row grade event listener
		$(document).on('input','.rowGrade',function(){
			parentName =$(this).attr('class').split(" ")[2];
			assignmentRowGrade(parentName[5]);
			assignmentRowWeight(parentName[5]);
		});
		//add row marks listener
		$(document).on('input','.rowMarks',function(){
			assignmentRowMarks(parentName[5]);
		});
		//add row wieght listener
		$(document).on('input','.rowWeight',function(){
			assignmentRowWeight(parentName[5]);
		});
		//add delete listener
		$(".assignmentDeleteBtn").eq(len-1).click(assignmentDeleteBtnListener);
	});
}



function assignmentDeleteBtnListener()
{
	var rowNum= $("#assignmentTable tr").length-1;	//gives real number of rows in ass table
	if(rowNum<=1)
		alert("Need at least 1 row")
	else
	{	var n = $(this).parent().siblings(":first").text();
		$(this).closest('tr').remove();
		onDelete(n);
	}
}


function addRowMarksListener()
{
	var classname = document.getElementsByClassName("rowMarks");
	var parentName;
	for (var i = 0; i < classname.length; i++) {
		classname[i].addEventListener('input', function(e){
			parentName = e.srcElement.className.split(" ")[2];
			//call function that deals with weigth and grade calculation
			assignmentRowMarks(parentName[5]);
		});
	}
}

function addRowWeigthListener()
{
	var classname = document.getElementsByClassName("rowWeight");
	var parentName;
	for (var i = 0; i < classname.length; i++) {
		classname[i].addEventListener('input', function(e){
			parentName = e.srcElement.className.split(" ")[2];
			//call function that deals with weigth and grade calculation
			assignmentRowWeight(parentName[5]);
		});
	}
}

function addRowGradeListener()
{
	var classname = document.getElementsByClassName("rowGrade");
	var parentName;
	for (var i = 0; i < classname.length; i++) {
		classname[i].addEventListener('input', function(e){
			parentName = e.srcElement.className.split(" ")[2];
			assignmentRowGrade(parentName[5]);
			assignmentRowWeight(parentName[5]);
		});
	}
}

//calculates the result from yex boxes and displays them in result boxes
function checkYesBoxes()
{
	var current = $(".yesBox").eq(0).val();
	var desire = $(".yesBox").eq(1).val()
	var weigth = $(".yesBox").eq(2).val();
	var total = $(".yesBox").eq(3).val();
	var reqPercentage =0;
	if( $.isNumeric(current)  && $.isNumeric(desire) && $.isNumeric(weigth) )
	{
		reqPercentage = (desire-current)/weigth;
		$(".resultBox").eq(0).val((reqPercentage*100).toFixed(2));
		if($.isNumeric(total) )
			$(".resultBox").eq(1).val((reqPercentage*total).toFixed(1));
	}
}


//calculate values in the assignment table
function assignmentRowMarks(n)
{
	var mark = parseInt($(".noBox"+n).eq(0).val());
	var totalMark = parseInt($(".noBox"+n).eq(1).val());
	var calcGrade=0;
	if( $.isNumeric(mark) && $.isNumeric(totalMark) )
	{
		calcGrade = mark/totalMark;
		if(calcGrade>=0 && calcGrade<=100)
			 $(".noBox"+n).eq(2).val( (calcGrade*100).toFixed(2) );
	}
}

//stores all the calculated assignment grade*weight marks in respective index
var gradeArr=[0,0,0,0,0,0];

// calculate values in the assignment table
function assignmentRowGrade(n)
{
	var mark;
	var totalMark ;
	var grade = parseInt($(".noBox"+n).eq(2).val());
	if(grade>=0 && grade<=100)
	{
		mark = grade;
		totalMark = 100;
		$(".noBox"+n).eq(0).val(mark.toFixed(1));
		$(".noBox"+n).eq(1).val( totalMark);	
	}
}

// checks if row's grade and weight are both valid.
// then adds it to current grade in gradeTable, current grade box
function assignmentRowWeight(n)
{
	var grade = parseInt($(".noBox"+n).eq(2).val());
	var weigth= parseInt($(".noBox"+n).eq(3).val());
	if(grade>=0 && grade<=100 && weigth>=0 && weigth<=100)
	{
		//row[n]'s grade*weight = currentGrade
		var currentGrade = grade*weigth/100;
		//insert in respective index in total grade
		gradeArr[n-1] = currentGrade;
		//sums the grade array and displays
		 displayCurrentGrade();
	}
}

function onDelete(n)
{
	n= parseInt(n);
	var trLen = $("#assignmentTable tr").length;
	 for(var i=n; i<=trLen;i++)
	 {
		$( "#assignmentTable tr:eq("+i+") td:eq(0)").html("<b>"+(i)+"</b>");
		var classname = document.getElementsByClassName("noBox"+(i));
		$(".noBox"+i).each(function(){
			$(this).addClass("noBox"+(i-1));
			$(this).removeClass("noBox"+i);
		});		
	 }
	 removeI(n-1);
	 displayCurrentGrade();
}

function displayCurrentGrade()
{
	var sum = gradeArr.reduce(function(gradeArr, b) { return gradeArr+ b; }, 0);
	$(".yesBox").eq(0).val(sum);
}

function removeI(i)
{
	var len = gradeArr.length;
	for(var j=i;j<len;j++)
	{
		gradeArr[j] = gradeArr[j+1];
	}
	gradeArr.pop();
}


// wrapper div appear and disappear
//1=black, 0=white
function windowScroll()
{ 	
	var header = $('#wrapper');
	var range = 200;
	var scrollTop = $(this).scrollTop();
    var offset = header.offset().top;
    var height = header.outerHeight();
   // if(isTwoTableVisibile = true)
    // {
    offset = offset + height / 2;
    var calc = 1 - (scrollTop - offset + range) / range;
  
    header.css({ 'opacity': calc });
  
    if ( calc > '1' ) {
      header.css({ 'opacity': 1});
    } else if ( calc < '0' ) 
    {
		header.css({ 'opacity': 0});
    }
	// }
	// console.log(isTwoTableVisibile);
}



window.fbAsyncInit = function() {
FB.init({
  appId      : '1696449930685183',
  xfbml      : true,
  version    : 'v2.8'
});
};

(function(d, s, id){
 var js, fjs = d.getElementsByTagName(s)[0];
 if (d.getElementById(id)) {return;}
 js = d.createElement(s); js.id = id;
 js.src = "//connect.facebook.net/en_US/sdk.js";
 fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));




function FBsignup()
{
	FB.login(function(response){
	  if (response.status === 'connected') 
	  {
	  	if(response.authResponse)
	  	{
	  		FB.api('/me',{ fields: 'email'},function(response)
	  		{
	  			$('#signupModal').modal('hide');
			    $('#fbSignupModal').modal('show');
			    FBuserEmail = response.email;
	  		});
	  	}
	    // Logged into your app and Facebook.
	    
	  } else if (response.status === 'not_authorized') {
	    // The person is logged into Facebook, but not your app.
	    alert("what!");
	  } else {
	    // The person is not logged into Facebook, so we're not sure if
	    // they are logged into this app or not.
	    alert("oops");
	  }
	}, {
		scope: 'public_profile,email',
		return_scopes: true
	});

}




function FBlogin(e)
{
	FB.login(function(response){
	  if (response.status === 'connected') 
	  {
	  		FB.api('/me',{ fields: 'email'},function(response)
	  		{
			    FBuserEmail = response.email;
			 	alert(FBuserEmail);
			 	FBloginAjax(e);

	  		});
	  } else if (response.status === 'not_authorized') {
	    // The person is logged into Facebook, but not your app.
	    alert("what!");
	  } else {
	    // The person is not logged into Facebook, so we're not sure if
	    // they are logged into this app or not.
	    alert("oops");
	  }
	}, {
		scope: 'public_profile,email',
		return_scopes: true
	});

}

function FBloginAjax(e) 
{
		alert(FBuserEmail);
		e.preventDefault();
		$.ajax({
			type:'POST',
			url:'/home/fbLogin/',
			dataType: 'text',
			data:{
				email:FBuserEmail,
				csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
			},
			success: function(response){
				if(response == 'success')
				{
					// alert("success")
					var url = "http://localhost:8000/user/home";
					window.location.replace(url);
				}
				else
				{
					alert("call fail function");
					$("#fbLoginWarningDiv").show();
					$("#loginBodyDiv").hide();
					$("loginWarnginFooterDiv").show();
					$("#loginFooterDiv").hide();
				}
			}
		});
}



// function that gets called when users fail to log or sign up and error msg shows. this reinistiates everything,
function closeReinitiate()
{
		setTimeout(function(){
	  		// signup modal
			$('#fbSignupDiv').show();
			$('#fbSigupFooter').show();
			$('#fbWarningDiv').hide();

			// login modal
			$("#fbLoginWarningDiv").hide();
			$("#loginBodyDiv").show();
			$("loginWarnginFooterDiv").hide();
			$("#loginFooterDiv").show();
		}, 2000);
}


// function showConfirmationModal()
// {
	
// }