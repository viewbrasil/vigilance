//DEFINE VARIABLES
var curId = "";
var contextMenu = ".availableSettings, .profile-stuff, .notifications";
var hideTrigger = ".frame";

$(document).ready(function() {
  prevState = $("#2nd")
    .children()
    .first()
    .next()
    .html();
  $("#2nd")
    .children()
    .first()
    .next()
    .html(
      '<div class="loader"><div class="dot"></div><div class="dot"></div><div class="dot"></div><p class="esparagrafo"></p></div>'
    );
  $(".esparagrafo").typed({
    strings: [
      "Carregando...",
      "Com devmind.io, <br> Você trabalha de qualquer lugar. "
    ],
    backDelay: 1500,
    loop: true,
    typeSpeed: 10
  });

  $("body").on("click", "#acessarbtn", function() {
    directory = $(".span").attr("data-root");
    $("#3rd")
      .children()
      .first()
      .next()
      .html(
        '<div class="loader"><div class="dot"></div><div class="dot"></div><div class="dot"></div><p class="esparagrafo"></p></div>'
      );
    $(".esparagrafo").typed({
      strings: [
        "Com devmind.io, <br> Você trabalha de qualquer lugar. ",
        "Carregando..."
      ],
      backDelay: 1500,
      loop: true,
      typeSpeed: 10
    });

    $.ajax({
      url: "https://devmind.io/workspace/github_final",
      type: "post",
      data: {
        dir: directory
      },

      success: function(response) {
        if (response.trim() != "false") {
          window.location.replace("https://devmind.io/workspace");
        }
      }
    });
  });

  $("body").on("click", ".li", function(el) {
    $(".li").removeClass("active");
    el = el.target;
    $(el).addClass("active");
  });

  $("body").on("click", ".icon1", function(el) {
    element_id = $(el.target)
      .parent()
      .parent()
      .attr("data-id");

    $(".remodal-confirm").css("display", "inline");
    $(".remodal-cancel").css("display", "inline");
    $("#remodal-title").text("Deletando projeto");
    $("#remodal-text").text(
      "Tem certeza de que deseja deletar seu projeto? Suas credenciais de acesso serão deletadas do nosso servidor."
    );
    $(".remodal-confirm").attr(
      "onclick",
      "delete_project(" + element_id + ");"
    );

    var inst = $("[data-remodal-id=modal]").remodal();

    inst.open();
  });

  $("body").on("click", "#icon3", function() {
    $("#ftp_form")[0].reset();
    $("#2nd").addClass("modalmove2");
    $("#1st").addClass("modalmove");
  });

  $("body").on("change", ".devmind-github-select", function() {
      $(".filetree").html('');
    $.ajax({
      url: "set_branch",
      type: "post",
      data: {
        branch: $(".devmind-github-select :selected").text()
      },

      success: function(response) {
        $(".span").html("/");
        $(".span").attr("data-root", "/");

         $(".filetree").fileTree(
          {
            root: "/",
            script: "https://devmind.io/workspace/scan/github_auth_files"
          },
          function(file) {}
        );
      }
    });
  });

  $("body").on("click", "#send", function() {
    $.ajax({
      url: "set_branch",
      type: "post",
      data: {
        branch: "unset_branch"
      },

      success: function(response) {
        active_id = "";
        active_name = "";
        active_id = $(".entry-selected").attr("data-id");
        active_name = $(".entry-selected").attr("data-name");
        $(".devmind-github-select").html("");
         $(".filetree").html("");

        initial_state = $("#2nd")
          .children()
          .first()
          .next()
          .html();
        $("#2nd")
          .children()
          .first()
          .next()
          .html(
            '<div class="loader"><div class="dot"></div><div class="dot"></div><div class="dot"></div><p class="esparagrafo"></p></div>'
          );
        $(".esparagrafo").typed({
          strings: [
            "Carregando...",
            "Com devmind.io, <br> Você trabalha de qualquer lugar. "
          ],
          backDelay: 1500,
          loop: true,
          typeSpeed: 10
        });

        $.ajax({
          url: "scan/github_auth",
          type: "post",
          data: {
            ide: active_id,
            nami: active_name
          },

          success: function(response) {
            if (response.trim() == "true") {
              $(".span").html("/");
              $(".span").attr("data-root", "/");

              $.ajax({
                url: "get_branches",

                success: function(response) {
                  response = $.parseJSON(response);
                        
                  response.forEach(function(index, number) {
                    $(".devmind-github-select").append(
                      '<option value="' +
                        index.name +
                        '">' +
                        index.name +
                        "</option>"
                    );
                  });

                  $(".span").html("/");
                  $(".span").attr("data-root", "/");

                  if($('.devmind-github-select option[value=master]').length)
                  {
                      $(".devmind-github-select").val('master');
                  }
                  else
                  {
                      $(".devmind-github-select option:first").val()
                  }

                  $("#2nd")
                    .children()
                    .first()
                    .next()
                    .html(initial_state);
                  $("#2nd")
                    .addClass("modalmove2")
                    .removeClass("modalmove");
                  $("#3rd")
                    .addClass("modalmove")
                    .removeClass("modalmove2");

            
                  refresh_project_list();

                $(".filetree").html('');
                  $.ajax({
                    url: "set_branch",
                    type: "post",
                    data: {
                      branch: $(".devmind-github-select :selected").text()
                    },

                    success: function(response) {
                        
                       $(".filetree").fileTree(
                        {
                          root: "/",
                          script:
                            "https://devmind.io/workspace/scan/github_auth_files"
                        },
                        function(file) {}
                      );
                    }
                  });
                }
              });
            } else {
              $("#2nd")
                .children()
                .first()
                .next()
                .html(initial_state);
              refresh_project_list();

              $(".remodal-confirm").removeAttr("onclick");
              $(".remodal-confirm").css("display", "inline");
              $(".remodal-cancel").css("display", "none");
              $("#remodal-title").text("Projeto Inacessível.");
              $("#remodal-text").text(
                "Não pudemos conectar ao servidor remoto. Por favor, verifique as credenciais de acesso e sua conexão à internet. Reason: " +
                  response.trim()
              );

              var inst = $("[data-remodal-id=modal]").remodal();

              inst.open();
            }
          }
        });
      }
    });
  });

  $("#lista").html(
    '<div class="loader"> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div> <span class="div"></span></div>'
  );
  $.ajax({
    url: "https://devmind.io/workspace/github_projects",
    type: "post",

    success: function(response) {
      $("#lista").html("");
      $("#2nd")
        .children()
        .first()
        .next()
        .html(prevState);
      if (
        response.trim() != "{}" &&
        response.trim() != "false" &&
        response.trim() !== ""
      ) {
        $("#lista").html("");
        response = $.parseJSON(response);
        $(response).each(function(index, obj) {
          $("#lista").append(
            '<div data-name="' +
              obj.full_name.trim() +
              '" data-id="' +
              obj.id +
              '" class="entry"><p>' +
              obj.name.trim() +
              "</p><span>" +
              obj.full_name.trim() +
              "</span></div>"
          );
        });
      }
    }
  });

  $("body").on("click", "#botao2", function(e) {
    e.preventDefault();
    $("#2nd")
      .removeClass("modalmove")
      .removeClass("modalmove2")
      .addClass("modalmove");
    $("#1st")
      .removeClass("modalmove")
      .removeClass("modalmove2");

    $("#projname").val("");
    $("#url").val("");
    $("#nome").val("");
    $("#senha").val("");
    $("#porta").val("");
  });

  $("body").on("click", "#botao", function(e) {
    /*$('#3rd').removeClass('modalmove').removeClass('modalmove2').addClass('modalmove')
        $('#1st').removeClass('modalmove').removeClass('modalmove2').addClass('modalmove2')*/

    e.preventDefault();
    p_name = $("#projname").val();

    var form = $("#ftp_form");

    // console.log(form)

    $("#botao").css("display", "none");
    $("#botao2").css("display", "none");
    $("#spinner-frame").css("display", "block");
    encrypt_form(form, function(value) {
      var string = value;

      $.ajax({
        url: "workspace/edit_ftp_project",
        type: "post",
        data: {
          str: string,
          ide: curId
        },
        success: function(response) {
          if (response.trim() == "true") {
            $("#botao").css("display", "inline");
            $("#botao2").css("display", "inline");
            $("#spinner-frame").css("display", "none");

            $("#botao2")[0].click();
            refresh_project_list();
          } else {
            $(".modal").effect("shake");
            $("#botao").css("display", "block");
            $("#spinner-frame").css("display", "none");
          }
        }
      });
    });
  });
  
  	//Faz com que os menus sumam com o clique em certas regiões da tela
  $(hideTrigger).click(function() {
    $(contextMenu).hide();
  });

  //Mostra o menu de contexto relacionado as notificações e restaura o icone para o estado padrão
  $(".notif, .notifCount").click(function() {
    $(".profile-stuff, .notifCount, .availableSettings").hide();
    $(".notif").removeClass("hasNotif");
    $(".notifications").slideToggle(85);
  });

  //Mostra o menu de contexto relacionado as configurações
  $(".config, .option").click(function() {
    $(".notifications, .profile-stuff").hide();
    $(".availableSettings").slideToggle(85);
  });

  //Mostra o menu de contexto relacionado ao perfil
  $(".profile-pic").click(function() {
    $(".notifications, .availableSettings").hide();
    $(".profile-stuff").slideToggle(85);
  });
	
	//Quando uma entrada é selecionada, faz com que as demais sejam deselecionadas.
	$("body").on("click", ".entry", function(e) {
        $(".entry").removeClass("entry-selected");
		$(this).addClass("entry-selected");
	});
	
	$(".addProj").click(function(){
    $(".new-project").fadeIn(125);
	});
	
	$(".cancel").click(function(){
    $(".new-project").fadeOut(125);
	});
	
	//move a tela de projetos para a esquerda e mostra a tela de diretórios
	$(".acess").click(function(){
    $(".project-manager").animate({left: "-100%", opacity: "0"});
		$(".directory-manager").addClass("active");
	});
	
	$(".cancel-dir").click(function(){
		if ($(window).width() > 900) {
			$(".project-manager").animate({left: "30vw", opacity: "1"});
			$(".directory-manager").removeClass("active")
		} else if ($(window).width() <= 768) {
			$(".project-manager").animate({left: "10vw", opacity: "1"});
			$(".directory-manager").removeClass("active")
		} 
    
	});
});

function porra(ide) {
  $("#2nd").addClass("modalmove2");
  $("#1st").addClass("modalmove");

  curId = ide;

  $.ajax({
    url: "workspace/get_ftp_projects",
    dataType: "json",
    type: "POST",
    scriptCharset: "utf-8",
    data: {
      id: ide
    },
    success: function(response) {

      if (response.success === true) {
        var credential = response.credential;
        var chek = $("#switch-2").is(":checked");

        if (typeof credential.ftps != "undefined" && chek === false) {
          $("#switch-2").trigger("click");
        } else if (chek === true) {
          $("#switch-2").trigger("click");
        }

        $("#projname").val(credential.projname);
        $("#url").val(credential.ftp);
        $("#nome").val(credential.username);
        $("#senha").val(decodeURIComponent(credential.password));
        $("#porta").val(credential.porta);
      }
    }
  });
}

function refresh_project_list() {
  $("#lista").html(
    '<div class="loader"> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div> <span class="div"></span></div>'
  );

  $.ajax({
    url: "https://devmind.io/workspace/github_projects",
    type: "post",

    success: function(response) {
      $("#lista").html("");
      $("#2nd")
        .children()
        .first()
        .next()
        .html(prevState);
      if (
        response.trim() != "{}" &&
        response.trim() != "false" &&
        response.trim() !== ""
      ) {
        $("#lista").html("");
        response = $.parseJSON(response);
        $(response).each(function(index, obj) {
          $("#lista").append(
            '<div data-name="' +
              obj.full_name.trim() +
              '" data-id="' +
              obj.id +
              '" class="entry"><p>' +
              obj.name.trim() +
              "</p><span>" +
              obj.full_name.trim() +
              "</span></div>"
          );
        });
      }
    }
  });
}

function delete_project(nb) {
  $.ajax({
    url: "workspace/delete_ftp_project",
    type: "post",
    data: {
      id: nb
    },

    success: function(response) {
      refresh_project_list();
    }
  });
}

function root_folder(el) {
  $(".span").html($(el).attr("rel"));
  $(".span").attr("data-root", $(el).attr("rel"));

  var napalm = $(".span")
    .html()
    .split("/");
  console.log(napalm.length);

  if (napalm.length >= 6) {
    text =
      ".../" +
      napalm[napalm.length - 3] +
      "/" +
      napalm[napalm.length - 2] +
      "/" +
      napalm[napalm.length - 1];
    $(".span").html(text);
  }
}