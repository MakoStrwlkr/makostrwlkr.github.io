#!/usr/bin/env python3
"""Placeholder resource — a tiny Cayley-graph adjacency demo.
Replace this file with your own scripts and update resources.html +
search-index.json (see README)."""

def adjacent(g, h, S, n):
    """Edge in Cay(Z_n, S)?  In an additive group, g^{-1}h is (h - g)."""
    return (h - g) % n in S

if __name__ == "__main__":
    n, S = 6, {1, n_minus_1} if (n_minus_1 := 5) else {1, 5}
    edges = [(g, h) for g in range(n) for h in range(n) if g < h and adjacent(g, h, S, n)]
    print(f"Cay(Z_{n}, {sorted(S)}) has {len(edges)} edges:")
    for e in edges:
        print("  ", e)
