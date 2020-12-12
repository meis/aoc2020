use std::env;

mod day01;
mod day02;

fn main() {
    let args: Vec<String> = env::args().collect();

    let default_day = &format!("_");
    let day = args.get(1).unwrap_or(default_day);
    let default_file = &format!("src/day{}/input", day);
    let input_file = args.get(2).unwrap_or(default_file);

    println!("{}", input_file);

    match day.as_str() {
        "01" => day01::run(input_file),
        "02" => day02::run(input_file),
        _ => println!("not implemented"),
    }

    println!("{:?}", args);
}
