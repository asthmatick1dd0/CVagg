// Package cvagglog provides logging utilities
package cvagglog

import (
	"os"
	"time"

	"github.com/spf13/viper"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"gopkg.in/natefinch/lumberjack.v2"
)

type Logger struct {
	*zap.Logger
}

func NewLogger(conf *viper.Viper) *Logger {
	return &Logger{
		initZap(conf),
	}
}

func initZap(conf *viper.Viper) *zap.Logger {
	logFile := conf.GetString("log.filename")
	logLevel := conf.GetString("log.level")
	zapLevel := getLevel(logLevel)

	hook := lumberjack.Logger{
		Filename:   logFile,                        //
		MaxSize:    conf.GetInt("log.max_size"),    //
		MaxBackups: conf.GetInt("log.max_backups"), //
		MaxAge:     conf.GetInt("log.max_age"),     //
		Compress:   conf.GetBool("log.compress"),   //
	}

	encoderConfig := zapcore.EncoderConfig{
		TimeKey:        "time",
		LevelKey:       "level",
		MessageKey:     "msg",
		CallerKey:      "caller",
		EncodeTime:     timeEncoder,
		EncodeLevel:    zapcore.CapitalColorLevelEncoder,
		EncodeCaller:   zapcore.ShortCallerEncoder,
		EncodeDuration: zapcore.StringDurationEncoder,
	}
	encoder := zapcore.NewConsoleEncoder(encoderConfig)

	core := zapcore.NewCore(
		encoder, //
		zapcore.NewMultiWriteSyncer(zapcore.AddSync(os.Stdout), zapcore.AddSync(&hook)), //
		zapLevel, //
	)
	return zap.New(core, zap.Development(), zap.AddCaller(), zap.AddStacktrace(zap.ErrorLevel))
}

func getLevel(logLevel string) zapcore.Level {
	switch logLevel {
	case "debug":
		return zap.DebugLevel
	case "info":
		return zap.InfoLevel
	case "warn":
		return zap.WarnLevel
	case "error":
		return zap.ErrorLevel
	}
	return zap.InfoLevel
}

func timeEncoder(t time.Time, enc zapcore.PrimitiveArrayEncoder) {
	enc.AppendString(t.Format("2006/01/02 15:04:05"))
}
