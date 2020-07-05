export interface Cell {
    isBomb: boolean;
    nearbyBombs: number;
    isFlagged: boolean;
    isClicked: boolean;
}