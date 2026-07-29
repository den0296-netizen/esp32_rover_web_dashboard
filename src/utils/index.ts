export function deadzone(value: number, limit = 8)
{
    return Math.abs(value) < limit ? 0 : value;
}