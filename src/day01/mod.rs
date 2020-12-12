use std::fs;

pub fn run(input_file: &String) {
    let nums: Vec<usize> = fs::read_to_string(input_file)
        .unwrap()
        .lines()
        .map(|x| x.parse::<usize>().unwrap())
        .collect();

    for i in 0..nums.len() {
        for j in i..nums.len() {
            if nums[j] + nums[i] == 2020 {
                println!(
                    "The two entries that sum 2020 are {} and {} and multiplying them produces: {}",
                    nums[i],
                    nums[j],
                    nums[i] * nums[j]
                );
            }
            for k in j..nums.len() {
                if nums[j] + nums[i] + nums[k] == 2020 {
                    println!(
                        "The three entries that sum 2020 are {}, {} and {} and multiplying them produces: {}",
                        nums[i],
                        nums[j],
                        nums[k],
                        nums[i] * nums[j] * nums[k]
                    );
                }
            }
        }
    }
}
