var app = angular.module("app", []);

app.controller("MainControl", function ($scope, $compile) {

  // Setting up pet

  $scope.pet = {};
  $scope.pet_to_play = {};
  $scope.pet_to_play.breed = "slime";
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
    $scope.initialize_pet();
    $scope.initialize_game();
    $scope.pet_to_play = {};
    $scope.started = true;
    $scope.start_scene('house');

  }

  $scope.is_current_breed = function (breed) {
    return $scope.pet_to_play.breed === breed || $scope.pet.breed === breed;
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
    $scope.minus_hunger(0.1);
    if ($scope.trigger_random_event(5)) {
      $scope.game_message = "Look! You found something!";
      $scope.insert_random_item();
    }
  }


  // ----------- Game Engine --------------

  $scope.save_game = function () {
    localStorage.setItem('my_pet', JSON.stringify($scope.pet));
    $scope.game_message = "Saved!";
  }

  $scope.load_game = function () {
    var saved_pet = JSON.parse(localStorage.getItem('my_pet'));
    if (saved_pet) {
      $scope.pet = saved_pet;
      $scope.started = true;
      $scope.start_scene('house');
      $scope.initialize_game();
      $scope.pet_to_play = {};
    }
  }

  $scope.clear_messages = function () {
    $scope.game_message = "";
  }

  $scope.random_number = function (min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  }

  $scope.trigger_random_event = function (lucky_num) {
    var num = $scope.random_number(0, 30);
    return num === lucky_num;
  }

  $scope.random_item_position = function () {
    var position = $scope.random_number(10, 400);
    return position;
  }

  $scope.random_item_index = function () {
    var index = $scope.random_number(0, $scope.items.length-1);
    return index;
  }

  $scope.generate_random_item = function () {
    var part_one = "<img src=\"assets/";
    var item_name = $scope.items[$scope.random_item_index()].name;
    var part_two = ".png\" class='game-item' style=\"left:";
    var position = $scope.random_item_position();
    var part_three = "px;\" ng-click=\"collect_item($event,'";
    var part_four = "')\" \>";
    return part_one + item_name + part_two + position + part_three + item_name + part_four;
  }

  $scope.insert_random_item = function () {
    var syntax = $scope.generate_random_item();
    $(".game-wrap").append($compile(syntax)($scope));
  }

  $scope.minus_hunger = function (minus) {
    if ($scope.pet.current_hunger > (0.5+minus)) {
      $scope.pet.current_hunger -= minus;
    }
  }

  $scope.initialize_pet = function () {
    $scope.pet.current_hunger = 1;
    $scope.pet.current_love = 1;
    $scope.pet.current_religion = 3;
    $scope.pet.inventory = [];
  }

  $scope.initialize_game = function () {
    $scope.create_lookup($scope.items, 'name', 'value', $scope.item_value_lookup);
    $scope.create_lookup($scope.items, 'name', 'detail', $scope.item_detail_lookup);
  }

  $scope.create_lookup = function (array, value1, value2, new_array) {
    for (var i = 0, len = array.length; i < len; i++) {
      new_array[array[i][value1]] = array[i][value2];
    }
  }




  // ------------- Gameplay ----------------

  // game data

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
  };

  $scope.religions = [
    { id: 0, name: "eggnostic" },
    { id: 1, name: "jewish"},
    { id: 2, name: "demigod (Greek)" },
    { id: 3, name: "atheist"}
  ];

  $scope.items = [
    { id: 0, category: 1, name: "egg", value: 10, detail: "An ordinary egg. Very delicious."},
    { id: 1, category: 1, name: "pet-milk", value: 30, detail: "Best for your pet's health! Who doesn't like milk? Unless your pet is lactose intolerant of course."}
  ];

  $scope.item_value_lookup = {};
  $scope.item_detail_lookup = {};




  // game functions that are directly executed from display

  $scope.current_item_information = "";
  $scope.current_item_name = "";

  $scope.open_bank = function () {
    $scope.pet['has_bank'] = true;
    $scope.game_message = "You opened an account at the Central Bank of Kerning City!";
  }

  $scope.open_inventory = function () {
    $('#inventory').openModal();
  }

  $scope.feed = function (food) {
    $('#inventory').closeModal();
    $scope.game_message = $scope.pet.name + " has devoured '" + food + "'!";
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
    $scope.game_message = "You pet " + $scope.pet.name + " !";
  }

  $scope.teach_religion = function (religion) {
    $scope.pet.current_religion = religion.value;
  }

  $scope.show_hunger_statements = function () {
    var rounded_hunger = Math.round($scope.pet.current_hunger);
    return $scope.hunger_statements[rounded_hunger];
  }

  $scope.collect_item = function ($event, item_name) {
    $event.currentTarget.remove();
    $scope.pet.inventory.push(item_name);
  }

  $scope.select_item = function (item_name) {
    $scope.current_item_information = $scope.item_detail_lookup[item_name];
    $scope.current_item_name = item_name;
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
