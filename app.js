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

  // Gameplay

  $scope.open_bank = function () {
    $scope.pet['has_bank'] = true;
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
