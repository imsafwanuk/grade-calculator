// gobal variable
var isTwoTableVisibile = true;
var FBuserEmail="";

$(document).ready(function()
{
	reCalculateGradeArr();
	checkGradeTable();
	//window scroll
	 $(window).scroll(windowScroll);

	//tooltip activation
	$('[data-toggle="tooltip"]').tooltip({
		trigger : 'hover'
	});
	//yes btn pressed, hides assignment table
	$("#yesBtn").click(function()
	{
		changeBtnColor(1);
		$( "#assignmentTableDiv" ).hide("slow" );
		// setTimeout( function(){
		// 		$("#tableMainDiv").css("margin-left", "30%");
		// 		$("#tableMainDiv").css("float", "none");						
		// }, 500 );
		isTwoTableVisibile = false;
		checkGradeTable();
	});
	
	//no btn pressed, brings back assignment table
	$("#noBtn").click(function()
	{
		changeBtnColor(0);
		// $("#tableMainDiv").css("margin-left", "0%");
		// $("#tableMainDiv").css("float", "right");
		$("#assignmentTableDiv").show("slow");
		isTwoTableVisibile = true;
		checkGradeTable();
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
							// alert("ok");
							$("#confirmSavedIcon").show();
							setTimeout(function(){
								 $("#confirmSavedIcon").hide();
							}, 1500);
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
		// alert("in-> "+username);
		// alert(FBuserEmail);
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
				if(response != 'fail')
				{
					//alert(response);
					//alert(response+"/user/home");
					var url = "http://checkmygrade.herokuapp.com/user/home";
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
							+"<td><input class='noBox rowGrade noBox"+len+"' type='text'  onClick='this.select()' onblur='checkGrade()'></input></td>"
							+"<td><input class='noBox rowWeight noBox"+len+"' type='text'  onclick='this.select()' onblur='chcekWeight()'></input></td>"
							+"<td><button class='btn btn-danger btn-xs assignmentDeleteBtn' data-title='Delete' data-placement='top' data-toggle='tooltip'><span class='glyphicon glyphicon-trash'></span></button></td>"
						+"</tr>"

		//add new row to table
		$('#assignmentTable').find('tbody:last').append(str);
		//add new, empty element in gradeArr
		gradeArr.push(0);

		//add row marks listener--as 1 row of has 2 rowMarks, we do a trick
		// 1st get the rowMarks number
		var n = $(".rowMarks").length;
		$(".rowMarks").eq(n-2).on("input", function(){
			var parentName = $(this).attr("class").split(" ")[2];
			assignmentRowMarks(parentName[5]);
			// calculate N'th rows current grade, aka grade[n]*weight[n]
			getNGrade(parentName[5]);
			// check grade table
			checkGradeTable();
		});

		$(".rowMarks").eq(n-1).on("input", function(){
			var parentName = $(this).attr("class").split(" ")[2];
			assignmentRowMarks(parentName[5]);
			// calculate N'th rows current grade, aka grade[n]*weight[n]
			getNGrade(parentName[5]);
			// check grade table
			checkGradeTable();
		});

		//add row grade event listener
		$(".rowGrade").eq(len-1).on("input", function(){
			var parentName = $(this).attr("class").split(" ")[2];
			assignmentRowGrade(parentName[5]);
			// calculate N'th rows current grade, aka grade[n]*weight[n]
			getNGrade(parentName[5]);
			// check grade table
			checkGradeTable();
		});

		//add row wieght listener
		$(".rowWeight").eq(len-1).on("input", function(){
			var parentName = $(this).attr("class").split(" ")[2];
			getNGrade(parentName[5]);
			// check grade table
			checkGradeTable();
		});
		
		//handles delete button
		$(".assignmentDeleteBtn").eq(len-1).click(assignmentDeleteBtnListener);
	});
}



function assignmentDeleteBtnListener()
{
	var rowNum= $("#assignmentTable tr").length-1;	//gives real number of rows in ass table
	console.log("table len: "+rowNum);
	if(rowNum<=1)
		alert("Need at least 1 row")
	else
	{	var n = $(this).parent().siblings(":first").text();
		$(this).closest('tr').remove();
		// console.log("getting deleted: "+n);
		onDelete(n);
	}
}



function onDelete(n)
{
	n = parseInt(n);
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


// function that adds listener events on assignment row marks
function addRowMarksListener()
{
	var classname = document.getElementsByClassName("rowMarks");
	var parentName;
	for (var i = 0; i < classname.length; i++) {
		classname[i].addEventListener('input', function(e){
			parentName = e.srcElement.className.split(" ")[2];
			//call function that deals with grade calculation
			assignmentRowMarks(parentName[5]);
			// calculate N'th rows current grade, aka grade[n]*weight[n]
			getNGrade(parentName[5]);
			// check grade table
			checkGradeTable();
		});
	}
}

//this function only validates if achieved mark and total mark are valid and numbers and, if the grade is 0 to 100%, it gets displayed.
function assignmentRowMarks(n)
{
	console.log("n: "+n);
	var mark = parseInt($(".noBox"+n).eq(0).val());
	var totalMark = parseInt($(".noBox"+n).eq(1).val());
	console.log(mark);
	var calcGrade=0;
	if( $.isNumeric(mark) && $.isNumeric(totalMark) )
	{
		console.log("soGood");
		calcGrade = mark/totalMark;
		calcGradePer = (calcGrade*100).toFixed(2)
		if(calcGradePer>=0 && calcGradePer<=100)
			 $(".noBox"+n).eq(2).val(calcGradePer);
		else
			$(".noBox"+n).eq(2).val("");
	}
	else
	{
		console.log("isEmpty");
		$(".noBox"+n).eq(2).val("");
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
			getNGrade(parentName[5]);
			//check grade Table
			checkGradeTable();
		});
	}
}

// this function gets the N'th rows current grade by grade[n]*weight[n]
function getNGrade(n)
{
	var grade = parseInt($(".noBox"+n).eq(2).val());
	var weigth= parseInt($(".noBox"+n).eq(3).val());
	//row[n]'s grade*weight = currentGrade
	var currentGrade = grade*weigth/100;
	if(currentGrade>=0 && currentGrade<=100)
		gradeArr[n-1] = currentGrade;	//insert in respective index in total grade
	else
		gradeArr[n-1] = 0;

	//sums the grade array and displays
	displayCurrentGrade();
}

function chcekWeight()
{
	var classname = document.getElementsByClassName("rowWeight");
	for (var i = 0; i < classname.length; i++) 
	{
		var weight = parseInt($(classname).eq(i).val());
		// if theres a weight and it meet the reqirement, then show otherwise delete
		if(weight<0 || weight>100)
			$(classname).eq(i).val("");
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
			// calculate N'th rows current grade, aka grade[n]*weight[n]
			getNGrade(parentName[5]);
			// check grade table
			checkGradeTable();

		});
	}
}

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

// this function checks if the all grades for assignment table are valid or not
function checkGrade() 
{
	console.log("hee");
	var classname = document.getElementsByClassName("rowGrade");
	for (var i = 0; i < classname.length; i++) 
	{
		console.log("Loop:"+i)
		var grade = parseInt($(classname).eq(i).val());
		// if theres no grade, then check if theres number on the achieved marks and total mark and if thats valid, display that
		if(isNaN(grade))
		{
			assignmentRowMarks(i+1);
			console.log("is NAN" +i);
		}
		// if theres a grade and it meet the reqirement, then show otherwise delete
		else if(grade<0 || grade>100)
		{
			$(classname).eq(i).val("");
			console.log("howto");
		}

		// calculate N'th rows current grade, aka grade[n]*weight[n]
		getNGrade(i);
	}

}


//stores all the calculated assignment grade*weight marks in respective index
var gradeArr=[0,0,0,0,0,0];




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


// this function changes the color of yes and no button on "Do u knw your grade" once one of them is clicked.
// if x == 1, yes btn is pressed, else no is pressed.
function changeBtnColor(x){
	if(x == 1)
	{
		$("#yesBtn").addClass("btn-default");
		$("#yesBtn").removeClass("btn-info");
		$("#noBtn").removeClass("btn-default");
		$("#noBtn").addClass("btn-info");

	}
	else
	{
		$("#noBtn").addClass("btn-default");
		$("#noBtn").removeClass("btn-info");
		$("#yesBtn").removeClass("btn-default");
		$("#yesBtn").addClass("btn-info");
	}
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
	//alert("h");
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
			   // alert(FBuserEmail);
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
					var url = "http://checkmygrade.herokuapp.com/user/home";
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


//this function should be called everytime any column in the assignment table that can affect the grade, is changed.
// this function hence, re calculates the grade table and results everytime
// function calculateGradeTable()
// {
		// functions that calcs gradetables are weightlistener something, display grades and checkyesbox
// }

// re Calculates GradeArr after page load
function reCalculateGradeArr()
{
	// get the assignment-grade class
	var rowGrade = document.getElementsByClassName("rowGrade");
	// get the assignment-weight class
	var rowWeight = document.getElementsByClassName("rowWeight");
	// go over all and insert them in gradeArr

	for(var i=0; i<rowGrade.length;i++)
	{
		var grade = parseInt($(rowGrade).eq(i).val());
		var weigth= parseInt($(rowWeight).eq(i).val());
		if(grade>=0 && grade<=100 && weigth>=0 && weigth<=100)
		{
			//row[n]'s grade*weight = currentGrade
			var currentGrade = grade*weigth/100;
			//insert in respective index in total grade
			gradeArr[i] = currentGrade;
		}
		else
		{
			gradeArr[i]=0;
		}
	}
	// alert("ok");
}


// this function checks/re-checks the grade table. ie it adjusts the 
function checkGradeTable()
{
	// get the current grade
	var currentGrade= $('#currentGrade').val();

	// get the desired grade
	var desiredGrade= $('#desiredGrade').val();

	// get final weight
	var finalWeight= $('#finalWeight').val();	

	// get total marks
	var total = $(".yesBox").eq(3).val();

	var reqPercentage =0;

	if ( $.isNumeric(currentGrade)  && $.isNumeric(desiredGrade) && $.isNumeric(finalWeight) )
	{
		reqPercentage = (desiredGrade-currentGrade)/finalWeight;
		$(".resultBox").eq(0).val((reqPercentage*100).toFixed(2));
		// $("#resultWeightSpan").text("out of "+finalWeight+" %");
		if($.isNumeric(total) )
		{
			$(".resultBox").eq(1).val((reqPercentage*total).toFixed(1));
		}
	}

}
