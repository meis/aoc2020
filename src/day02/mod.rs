use regex::Regex;
use std::fs;

pub fn run(input_file: &String) {
    let input = fs::read_to_string(input_file).unwrap();

    let mut valid_method_1 = 0;
    let mut valid_method_2 = 0;

    for line in input.lines() {
        let (password_policy, password) = parse_line(line);
        if password_policy.validate_method_1(password) {
            valid_method_1 += 1;
        }
        if password_policy.validate_method_2(password) {
            valid_method_2 += 1;
        }
    }

    println!("Valid with method 1: {}", valid_method_1);
    println!("Valid with method 2: {}", valid_method_2);
}

struct PasswordPolicy {
    first_number: usize,
    second_number: usize,
    character: char,
}

impl PasswordPolicy {
    fn new(first_number: usize, second_number: usize, character: char) -> PasswordPolicy {
        PasswordPolicy {
            first_number,
            second_number,
            character,
        }
    }

    fn validate_method_1(&self, password: &str) -> bool {
        let mut count = 0;

        for char in password.chars() {
            if char == self.character {
                count += 1;
            }
        }

        count >= self.first_number && count <= self.second_number
    }

    fn validate_method_2(&self, password: &str) -> bool {
        let first_index = self.first_number - 1;
        let second_index = self.second_number - 1;
        let characters: Vec<char> = password.chars().collect();

        let first_char = characters.get(first_index);
        let second_char = characters.get(second_index);

        match (first_char, second_char) {
            (Some(first), Some(second)) => {
                if *first == self.character {
                    *second != self.character
                } else {
                    *second == self.character
                }
            }
            _ => false,
        }
    }
}

fn parse_line(line: &str) -> (PasswordPolicy, &str) {
    let r: Regex =
        Regex::new(r"^([[:digit:]]+)-([[:digit:]]+) ([[:word:]]): ([[:word:]]+)$").unwrap();
    let captures = r.captures(line).unwrap();
    let index_1 = captures
        .get(1)
        .map_or(0, |m| m.as_str().parse::<usize>().unwrap());
    let index_2 = captures
        .get(2)
        .map_or(0, |m| m.as_str().parse::<usize>().unwrap());
    let letter: char = captures
        .get(3)
        .map_or(' ', |m| m.as_str().parse::<char>().unwrap());
    let password = captures.get(4).map_or("", |m| m.as_str());

    (PasswordPolicy::new(index_1, index_2, letter), password)
}
