// Package config provides configuration settings for the application
package config

import (
	"flag"
	"fmt"
	"os"

	"github.com/spf13/viper"
)

func NewConfig() *viper.Viper {
	envConf := os.Getenv("APP_CONF")
	configFile := ""
	flag.StringVar(&envConf, "conf", configFile, "config path")
	flag.Parse()
	fmt.Println("load conf file: ", configFile)
	return getConfig(envConf)
}

func getConfig(path string) *viper.Viper {
	conf := viper.New()
	conf.SetConfigFile(path)
	err := conf.ReadInConfig()
	if err != nil {
		panic(err)
	}
	return conf
}
