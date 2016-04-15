var app = angular.module("app", []);

app.controller("MainControl", function ($scope) {

  // Setting up pet

  $scope.pet = {};
  $scope.pet_to_play = {};
  $scope.started = false;

  $scope.add_pet = function (chosen_pet) {
    len = chosen_pet.name.length;
    if (0 < len && len < 5) {
      chosen_pet.name_short = true;
    } else if (4 < len && len < 8) {
      chosen_pet.name_medium = true;
    } else {
      chosen_pet.name_long = true;
    }
    $scope.pet = chosen_pet;
    $scope.pet.current_hunger = 1;
    $scope.pet.current_love = 1;
    $scope.pet.current_religion = 3;
    $scope.started = true;
    $scope.start_scene('house');
  }


  // Setting Scene

  $scope.scene_data = {
    "signup-form": 1,
    "house": 2,
    "bank": 3
  };

  $scope.current_scene = 1;

  $scope.is_current_scene = function (scene_name) {
    return $scope.scene_data[scene_name] === $scope.current_scene;
  }

  $scope.start_scene = function (scene_name) {
    $scope.current_scene = $scope.scene_data[scene_name];
    $scope.clear_messages();
  }


  // Game Engine

  $scope.saved = "";

  $scope.save_game = function () {
    localStorage.setItem('my_pet', JSON.stringify($scope.pet));
    $scope.saved = "Saved!";
  }

  $scope.load_game = function () {
    var saved_pet = JSON.parse(localStorage.getItem('my_pet'));
    if (saved_pet) {
      $scope.pet = saved_pet;
      $scope.started = true;
      $scope.start_scene('house');
    }
  }

  $scope.clear_messages = function () {
    $scope.feed_result = "";
    $scope.saved = "";
    $scope.pet_result = "";
  }

  // Gameplay

  $scope.feed_result = "";
  $scope.pet_result = "";

  $scope.hunger_statements = {
    1: "starving",
    2: "extremely hungry",
    3: "hungry",
    4: "fine",
    5: "full"
  };

  $scope.petting_statements = {
    1: "wants you to pet it",
    2: "wants you to pet it",
    3: "wants you to pet it",
    4: "loves you now :)"
  }

  $scope.religions = [
    { id: 0, name: "eggnostic" },
    { id: 1, name: "jewish"},
    { id: 2, name: "demigod (Greek)" },
    { id: 3, name: "atheist"}
  ]


  $scope.open_bank = function () {
    $scope.pet['has_bank'] = true;
  }

  $scope.open_feed = function () {
    $('#inventory').openModal();
  }

  $scope.feed = function (food) {
    $('#inventory').closeModal();
    $scope.feed_result = $scope.pet.name + " has devoured '" + food + "'!";
    if ($scope.pet.current_hunger >= 5) {
      $scope.pet.current_hunger = 5;
    } else {
      $scope.pet.current_hunger += 1;
    }
  }

  $scope.pet_pet = function () {
    if ($scope.pet.current_love < 4) {
      $scope.pet.current_love += 1;
    }
    $scope.pet_result = "You pet " + $scope.pet.name + " !"
  }

  $scope.teach_religion = function (religion) {
    $scope.pet.current_religion = religion.value;
  }

});

app.directive('gamePlay', function () {
    return {
      restrict: 'E',
      templateUrl: 'components/game-play.html'
    };
});

app.directive('gameControl', function () {
  return {
    restrict: 'E',
    templateUrl: 'components/game-control.html'
  };
});

app.directive('signupForm', function () {
  return {
    restrict: 'E',
    templateUrl: 'components/signup-form.html'
  };
});

app.directive('house', function () {
  return {
    restrict: 'E',
    templateUrl: 'components/house.html'
  };
});

app.directive('bank', function () {
  return {
    restrict: 'E',
    templateUrl: 'components/bank.html'
  };
});

app.directive('inventory', function () {
  return {
    restrict: 'E',
    templateUrl: 'components/inventory.html'
  };
});
