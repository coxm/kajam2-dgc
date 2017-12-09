# vim: sts=4 sw=4 ts=4 noet
tilemap_tmx_dir=src/assets/tilemaps
tilemap_json_dir=dist/assets/tilemaps


tilemaps_tmx=$(shell find $(tilemap_tmx_dir) -type f -path "*.tmx")
tilemaps_json=$(tilemaps_tmx:$(tilemap_tmx_dir)/%.tmx=$(tilemap_json_dir)/%.json)


.PHONY: ts
ts:
	./node_modules/.bin/tsc


$(info tilemaps json $(tilemaps_json))
.PHONY: tiles
tiles: $(tilemaps_json)
	


$(tilemap_json_dir)/%.json: $(tilemap_tmx_dir)/%.tmx
	"$(TILED_BIN)" --export-map json "$+" "$@"
