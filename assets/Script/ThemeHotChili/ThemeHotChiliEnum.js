ThemeHotChili.SpinLayerState = {
    Uninitialized: 0,
    Idle: 1,
    Rolling: 2,
    Show: 3,
  };
  
  ThemeHotChili.SpinTableState = {
    Uninitialized: 0,
    Idle: 1,
    Rolling: 2,
  };
  
  ThemeHotChili.SpinReelState = {
    Uninitialized: 0,
    Idle: 1,
    Rolling: 2,
    RollingWithResult: 3,
    AboutToStop: 4,
    BounceBack: 5,
  };
  
  ThemeHotChili.WinShowState = {};
  const winShowStateList = [
    "Idle",
    "ReSpin",
    "MultiFly",
    "ChipWin",
    "ScatterAnimation",
    "SymbolLineAnimation",
    "BigWinAnimation",
    "FreeGameTrigger",
    "StandbyBeforeFreeGameEnter",
    "StandbyBeforeBonusGameEnter",
    "BonusGameEnter",
    "NoWinDelay",
    "WinDelay",
    "Checking",
  ];
  for (let i = 0; i < winShowStateList.length; i++) {
    ThemeHotChili.WinShowState[winShowStateList[i]] = i;
  }
  
  ThemeHotChili.PopState = {
    Expand: 1,
    Shrink: 2,
  };
  
  ThemeHotChili.PopupType = {
    FreeGamePopIn: 1,
    FreeGamePopAdd: 2,
    FreeGamePopOut: 3,
    BonusGamePopIn: 4,
    BonusGamePopAdd: 5,
    BonusGamePopOut: 6,
    MapGamePopIn: 7,
    MapGamePopOut: 8,
    JpPopOut: 9,
    GameFever: 10,
  };
  