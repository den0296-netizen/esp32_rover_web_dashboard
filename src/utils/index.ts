export function deadzone(value: number, limit = 3)
{
    return Math.abs(value) < limit ? 0 : value;
}

// throttle or steering is in between -100 and 100, but we want to to use this value for some percentage. For example if the speed limit is 10 then we want us use 10th of the value. So if the throttle is 100 then we want to use 10, if the throttle is 50 then we want to use 5, if the throttle is -100 then we want to use -10, etc.
export function applySpeedLimit(value: number, speedLimit: number)
{
    return Number((value * (speedLimit / 100)).toFixed(2));
}